function isVoter(value: any) {
  return !Array.isArray(value);
}

function retrieveStakeOf(elections: any) {
  const stakeOf = elections.stakeOf();
  //@ts-ignore
  return stakeOf.map(
    ([
      {
        //@ts-ignore
        args: [accountId],
      },
      //@ts-ignore
      stake,
    ]) => [accountId, stake]
  );
}

function retrieveVoteOf(elections: any) {
  const voteOf = elections.votesOf.entries();
  //@ts-ignore
  return voteOf.map(
    ([
      {
        //@ts-ignore
        args: [accountId],
      },
      //@ts-ignore

      stake,
    ]) => [accountId, stake]
  );
}

function retrievePrev(api: any, elections: any) {
  const stakes = retrieveStakeOf(elections);
  const votes = retrieveVoteOf(elections);

  const result: any[] = [];

  // @ts-ignore
  votes.forEach(([voter, votes]): void => {
    result.push([voter, { stake: api.registry.createType("Balance"), votes }]);
  });

  // @ts-ignore
  stakes.forEach(([staker, stake]): void => {
    const entry = result.find(([voter]) => voter.eq(staker));

    if (entry) {
      entry[1].stake = stake;
    } else {
      result.push([staker, { stake, votes: [] }]);
    }
  });

  return result;
}

export const retrieveCurrent = async (elections: any) => {
  const electionsInfo = await elections.voting.entries();

  // @ts-ignore
  return electionsInfo.map(
    ([
      {
        // @ts-ignore
        args: [accountId],
      },
      // @ts-ignore
      value,
    ]) => [
      accountId,
      isVoter(value)
        ? { stake: value.stake, votes: value.votes }
        : { stake: value[0], votes: value[1] },
    ]
  );
};

export const geVotes = async (api: any) => {
  const elections =
    (await api.query.phragmenElection) ||
    (await api.query.electionsPhragmen) ||
    (await api.query.elections);

  return elections
    ? elections.stakeOf
      ? retrievePrev(api, elections)
      : retrieveCurrent(elections)
    : [];
};
