import { parseImage } from "./proposals";
import { BN, bnSqrt, isFunction } from "@polkadot/util";
import { queryBalancesAccount, queryBalancesFree, queryNonceOnly, querySystemAccount, zeroBalance } from "./account";
import { getAccountId } from "./accountId";

const isCurrentStatus = (status: any) => {
  return !!status?.tally;
};

export const getBalance = async (address: any, api: any) => {
  const balanceInstances = api.registry.getModuleInstances(
    api.runtimeVersion.specName.toString(),
    "balances"
  );
  const accountId = getAccountId(address, api);
  let result = [];
  if (accountId) {
    result = [
      accountId,
      balanceInstances
        ? queryBalancesAccount(api, accountId, balanceInstances)
        : isFunction(api.query.system?.account)
        ? querySystemAccount(api, accountId)
        : isFunction(api.query.balances?.account)
        ? queryBalancesAccount(api, accountId)
        : isFunction(api.query.balances?.freeBalance)
        ? queryBalancesFree(api, accountId)
        : queryNonceOnly(api, accountId),
    ];
  } else {
    const zB = await zeroBalance(api)
    result = [
      api.registry.createType("AccountId"),
      [
        api.registry.createType("Index"),
        [
          [
            zB,
            zB,
            zB,
            zB,
          ],
        ],
      ],
    ];
  }
};

export const votingBalances = async (addresses: any[], api: any) => {
  if (!addresses || !addresses.length) {
    return [];
  }

  const balances = addresses.map((accountId) => getBalance(accountId, api));

  return Promise.all(balances);
};

export const compareRationals = (n1: BN, d1: BN, n2: BN, d2: BN) => {
  while (true) {
    const q1 = n1.div(d1);
    const q2 = n2.div(d2);

    if (q1.lt(q2)) {
      return true;
    } else if (q2.lt(q1)) {
      return false;
    }

    const r1 = n1.mod(d1);
    const r2 = n2.mod(d2);

    if (r2.isZero()) {
      return false;
    } else if (r1.isZero()) {
      return true;
    }

    n1 = d2;
    n2 = d1;
    d1 = r2;
    d2 = r1;
  }
};

const calcPassingOther = (
  threshold: any,
  sqrtElectorate: any,
  { votedAye, votedNay, votedTotal }: any
) => {
  const sqrtVoters = bnSqrt(votedTotal);

  return sqrtVoters.isZero()
    ? false
    : threshold.isSuperMajorityApprove
    ? compareRationals(votedNay, sqrtVoters, votedAye, sqrtElectorate)
    : compareRationals(votedNay, sqrtElectorate, votedAye, sqrtVoters);
};

export const calcPassing = (threshold: any, sqrtElectorate: BN, state: any) => {
  return threshold.isSimpleMajority
    ? state.votedAye.gt(state.votedNay)
    : calcPassingOther(threshold, sqrtElectorate, state);
};

const calcVotesCurrent = (tally: any, votes: any[]) => {
  const allAye: any = [];
  const allNay: any = [];

  votes.forEach((derived): void => {
    if (derived.vote.isAye) {
      allAye.push(derived);
    } else {
      allNay.push(derived);
    }
  });

  return {
    allAye,
    allNay,
    voteCount: allAye.length + allNay.length,
    voteCountAye: allAye.length,
    voteCountNay: allNay.length,
    votedAye: tally.ayes,
    votedNay: tally.nays,
    votedTotal: tally.turnout,
  };
};

const calcVotesPrev = (votesFor: any[]) => {
  return votesFor.reduce(
    (state, derived) => {
      const { balance, vote } = derived;
      const isDefault = vote.conviction.index === 0;
      const counted = balance
        .muln(isDefault ? 1 : vote.conviction.index)
        .divn(isDefault ? 10 : 1);

      if (vote.isAye) {
        state.allAye.push(derived);
        state.voteCountAye++;
        state.votedAye.iadd(counted);
      } else {
        state.allNay.push(derived);
        state.voteCountNay++;
        state.votedNay.iadd(counted);
      }

      state.voteCount++;
      state.votedTotal.iadd(counted);

      return state;
    },
    {
      allAye: [],
      allNay: [],
      voteCount: 0,
      voteCountAye: 0,
      voteCountNay: 0,
      votedAye: new BN(0),
      votedNay: new BN(0),
      votedTotal: new BN(0),
    }
  );
};

const votesPrev = async (api: any, referendumId: BN) => {
  const votersFor = (await api.query.democracy.votersFor(referendumId)) || [];
  const votes = await api.query.democracy.voteOf.multi(
    votersFor.map((accountId: any) => [referendumId, accountId])
  );
  const balances: any = await votingBalances(votersFor, api);

  return votersFor.map((accountId: any, index: number) => ({
    balance:
      balances[index].votingBalance || api.registry.createType("Balance"),
    isDelegating: false,
    vote: votes[index] || api.registry.createType("Vote"),
  }));
};

const extractVotes = (mapped: any, referendumId: BN) => {
  return (
    mapped
      // @ts-ignore
      .filter(([, voting]) => voting.isDirect)
      // @ts-ignore
      .map(([accountId, voting]): [AccountId, VotingDirectVote[]] => [
        accountId,
        // @ts-ignore
        voting.asDirect.votes.filter(([idx]) => idx.eq(referendumId)),
      ])
      // @ts-ignore
      .filter(([, directVotes]) => !!directVotes.length)
      .reduce(
        // @ts-ignore
        (result: any, [accountId, votes]) =>
          // FIXME We are ignoring split votes
          votes.reduce(
            (
              result: any,
              // @ts-ignore
              [, vote]
            ) => {
              if (vote.isStandard) {
                result.push({
                  accountId,
                  isDelegating: false,
                  ...vote.asStandard,
                });
              }

              return result;
            },
            result
          ),
        []
      )
  );
};

const votesCurr = async (api: any, referendumId: BN) => {
  const allVoting = (await api.query.democracy.votingOf.entries()) || [];
  const mapped = allVoting.map(
    ([
      {
        // @ts-ignore
        args: [accountId],
      },
      // @ts-ignore
      voting,
    ]) => [accountId, voting]
  );
  const votes = extractVotes(mapped, referendumId);
  const delegations = mapped
    // @ts-ignore
    .filter(([, voting]) => voting.isDelegating)
    // @ts-ignore
    .map(([accountId, voting]): [AccountId, VotingDelegating] => [
      accountId,
      voting.asDelegating,
    ]);

  // add delegations
  // @ts-ignore
  delegations.forEach(([accountId, { balance, conviction, target }]): void => {
    // Are we delegating to a delegator
    // @ts-ignore
    const toDelegator = delegations.find(([accountId]) => accountId.eq(target));
    // @ts-ignore
    const to = votes.find(({ accountId }) =>
      accountId.eq(toDelegator ? toDelegator[0] : target)
    );

    // this delegation has a target
    if (to) {
      votes.push({
        accountId,
        balance,
        isDelegating: true,
        vote: api.registry.createType("Vote", {
          aye: to.vote.isAye,
          conviction,
        }),
      });
    }
  });

  return votes;
};

export const calcVotes = (
  sqrtElectorate: any,
  referendum: any,
  votes: any[]
) => {

  const state = isCurrentStatus(referendum.status)
    ? calcVotesCurrent(referendum.status.tally, votes)
    : calcVotesPrev(votes);
  return {
    ...state,
    isPassing: calcPassing(referendum.status.threshold, sqrtElectorate, state),
    votes,
  };
};

export const getSqrtElectorate = async (api: any) => {
  const totalIssuance = await api.query.balances.totalIssuance();
  return bnSqrt(totalIssuance);
};

const getReferendumVotes = async (referendum: any, api: any) => {
  const sqrtElectorate = await getSqrtElectorate(api);
  const votes = isFunction(api.query.democracy.votingOf)
    ? await votesCurr(api, referendum.index)
    : await votesPrev(api, referendum.index);

  return calcVotes(sqrtElectorate, referendum, votes);
};

const getReferendumsVotes = async (
  referendums: any,
  api: any
): Promise<any> => {
  if (!referendums.length) {
    return [];
  }
  const referendumVotes = referendums.map((referendum: any) =>
    getReferendumVotes(referendum, api)
  );
  return await Promise.all(referendumVotes);
};

const isOldInfo = (info: any) => {
  return !!info.proposalHash;
};

export const getStatus = (info: any) => {
  if (info.isNone) {
    return null;
  }

  const unwrapped = info.unwrap();

  if (isOldInfo(unwrapped)) {
    return unwrapped;
  } else if (unwrapped.isOngoing) {
    return unwrapped.asOngoing;
  }

  // done, we don't include it here... only currently active
  return null;
};

export const getReferendumInfo = async (index: any, info: any, api: any) => {
  const status = getStatus(info);

  if (!status) {
    return null;
  }

  const preImage = await api.query.democracy.preimages(status.proposalHash);

  return {
    image: await parseImage(api, preImage),
    imageHash: status.proposalHash,
    index: api.registry.createType("ReferendumIndex", index),
    status,
  };
};

export const getMultiReferendumsInfo = (ids: any, api: any) => {
  const referendumsInfos = ids.map(async (id) => {
    return await api.query.democracy.referendumsInfo(id)
  })
  return Promise.all(referendumsInfos);
}

export const getReferendumsInfo = async (api: any, ids: any) => {
  const referendumsInfos = await getMultiReferendumsInfo(
    ids,
    api
  );

  const infos = ids.map((id: any, index: number) =>
    getReferendumInfo(id, referendumsInfos[index], api)
  );

  const extractedInfo = await (
    await Promise.all(infos)
  ).filter((data) => !!data);

  return extractedInfo;
};

export const getReferendumsIds = async (api: any) => {
  if (!api.query.democracy?.lowestUnbaked) {
    return [];
  }

  const [first, total] = await api.queryMulti([
    api.query.democracy.lowestUnbaked,
    api.query.democracy.referendumCount,
  ]);

  return total.gt(first)
    ? [...Array(total.sub(first).toNumber())].map((_, i) => first.addn(i))
    : [];
};

export const getReferendumsActive = async (api: any): Promise<any> => {
  const ids = await getReferendumsIds(api);
  return ids.length
    ? await (await getReferendumsInfo(api, ids)).filter((data) => !!data)
    : [];
};

export const getReferendums = async (api: any) => {
  const referendums = (await getReferendumsActive(api)) || [];
  const votes = await getReferendumsVotes(referendums, api);

  return referendums.map((referendum, index) => ({
    ...referendum,
    ...votes[index],
  }));
};
