import { SubstrateEvent } from "@subql/types";
import BigNumber from "bignumber.js";
import { getEraExposure } from "../handlers/eraExposure";
import { getErasPoints } from "../handlers/erasPoints";
import { getValidatorsWithIdentity } from "../handlers/identity";
import { getProposals } from "../handlers/proposals";
import { accountQuery } from "../handlers/query";
import { getReferendums } from "../handlers/referendums";
import {
  getEraHistoric,
  getEraPrefs,
  getEraSlashes,
} from "../handlers/staking";
import {
  parseIdentity,
  getClusterInfo,
  getCommissionHistory,
  getCommissionRating,
  getPayoutRating,
} from "../handlers/utils";
import { getValidatorAddresses } from "../handlers/validators";
import { geVotes } from "../handlers/votes";
import { ValidatorRanking } from "../types";

// Flags to be filtered from UI
const stakingQueryFlags = {
  withDestination: false,
  withExposure: true,
  withLedger: true,
  withNominations: false,
  withPrefs: true,
};

export async function handleBlock({ block }: SubstrateEvent): Promise<void> {
  const validatorAddresses = await getValidatorAddresses(api);
  const validatorsInfo = await Promise.all(
    // @ts-ignore
    validatorAddresses.map(async (authorityId) => {
      const accountInfo = await accountQuery(
        authorityId,
        stakingQueryFlags,
        api
      );
      const identity = await getValidatorsWithIdentity(api, [authorityId]);
      return {
        ...accountInfo,
        identity,
        active: true,
      };
    })
  );

  console.log("validatorsInfo", validatorsInfo[0]);

  const erasHistoric = await getEraHistoric(api, false);
  const councilVotes = await geVotes(api);

  console.log("erasHistoric", erasHistoric[0]);
  console.log("councilVotes", councilVotes[0]);

  const eraIndexes = erasHistoric.slice(
    // 84 days history
    Math.max(erasHistoric.length - 84, 0)
  );

  let erasSlashes: any[] = [];
  for (const eraIndex of eraIndexes) {
    const eraSlashes = await getEraSlashes(api, eraIndex);
    erasSlashes = erasSlashes.concat(eraSlashes);
  }

  console.log("erasSlashes", erasSlashes[0]);

  let erasPreferences: any[] = [];
  for (const eraIndex of eraIndexes) {
    const eraPrefs = await getEraPrefs(api, eraIndex);
    erasPreferences = erasPreferences.concat(eraPrefs);
  }

  console.log("erasPreferences", erasPreferences[0]);

  const { maxNominatorRewardedPerValidator } = api.consts.staking;

  console.log("erasPreferences", maxNominatorRewardedPerValidator);

  const participateInGovernance: any = [];

  const proposals = await getProposals(api);
  const referendums = await getReferendums(api);

  console.log("proposals", proposals[0]);
  console.log("referendums", referendums[0]);

  // @ts-ignore
  proposals.forEach(({ seconds, proposer }) => {
    participateInGovernance.push(proposer.toString());
    seconds.forEach((accountId) =>
      participateInGovernance.push(accountId.toString())
    );
  });
  referendums.forEach(({ votes }) => {
    votes.forEach(({ accountId }) =>
      participateInGovernance.push(accountId.toString())
    );
  });

  let maxPerformance = 0;
  let minPerformance = 0;

  const nominatorsGlobal = await api.query.staking.nominators.entries();

  console.log("nominatorsGlobal", nominatorsGlobal[0]);

  const nominations = nominatorsGlobal.map(([key, nominations]) => {
    const nominator = key.toHuman()[0];
    const targets = nominations.toJSON()["targets"];
    return {
      nominator,
      targets,
    };
  });

  console.log("nominations", nominations[0]);

  const clusters: any = [];

  validatorsInfo.forEach(async (validator: any) => {
    const validatoRanking = new ValidatorRanking(validator.stashId.toString());
    console.log("validator", validator);
    const { active } = validator;
    const activeRating = active ? 2 : 0;

    const stashAddress = validator.stashId.toString();

    const controllerAddress = validator.controllerId.toString();
    const { verifiedIdentity, hasSubIdentity, name, identityRating } =
      parseIdentity(validator.identity);

    const identity = JSON.parse(JSON.stringify(validator.identity));

    // sub-accounts
    const { clusterMembers, clusterName } = getClusterInfo(
      hasSubIdentity,
      validatorsInfo,
      validator.identity
    );
    if (clusterName && !clusters.includes(clusterName)) {
      clusters.push(clusterName);
    }

    const partOfCluster = clusterMembers > 1;
    const subAccountsRating = hasSubIdentity ? 2 : 0;

    const nominators = active
      ? validator.exposure.others.length
      : nominations.filter((nomination) =>
          nomination.targets.some(
            // @ts-ignore
            (target) => target === validator.accountId.toString()
          )
        ).length;

    const nominatorsRating =
      nominators > 0 &&
      nominators <= maxNominatorRewardedPerValidator.toNumber()
        ? 2
        : 0;

    const slashes =
      erasSlashes.filter(
        // @ts-ignore
        ({ validators }) => validators[validator.accountId.toString()]
      ) || [];
    const slashed = slashes.length > 0;
    const slashRating = slashed ? 0 : 2;

    // commission
    const commission =
      parseInt(validator.validatorPrefs.commission.toString(), 10) / 10000000;

    const commissionHistory = getCommissionHistory(
      validator.accountId,
      erasPreferences
    );

    const commissionRating = getCommissionRating(commission, commissionHistory);

    let erasExposure: any = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const eraIndex of eraIndexes) {
      // eslint-disable-next-line no-await-in-loop
      const eraExposure = await getEraExposure(eraIndex, api);
      //   const eraExposure = await api.derive.staking.eraExposure(eraIndex); // need to change
      erasExposure = erasExposure.concat(eraExposure);
    }

    const erasPoints = await getErasPoints(eraIndexes, api);

    const councilBacking = validator.identity?.parent
      ? councilVotes.some(
          // @ts-ignore
          (vote) => vote[0].toString() === validator.accountId.toString()
        ) ||
        councilVotes.some(
          // @ts-ignore
          (vote) => vote[0].toString() === validator.identity.parent.toString()
        )
      : councilVotes.some(
          // @ts-ignore
          (vote) => vote[0].toString() === validator.accountId.toString()
        );
    const activeInGovernance = validator.identity?.parent
      ? participateInGovernance.includes(validator.accountId.toString()) ||
        participateInGovernance.includes(validator.identity.parent.toString())
      : participateInGovernance.includes(validator.accountId.toString());
    let governanceRating = 0;
    if (councilBacking && activeInGovernance) {
      governanceRating = 3;
    } else if (councilBacking || activeInGovernance) {
      governanceRating = 2;
    }

    const eraPointsHistory: any = [];
    const payoutHistory: any = [];
    const performanceHistory: any = [];
    const stakeHistory: any = [];
    let activeEras = 0;
    let performance = 0;
    // eslint-disable-next-line
    erasPoints.forEach((eraPoints: any) => {
      const { era } = eraPoints;
      let eraPayoutState = "inactive";
      let eraPerformance = 0;
      if (eraPoints.validators[stashAddress]) {
        activeEras += 1;
        const points = parseInt(
          eraPoints.validators[stashAddress].toString(),
          10
        );
        eraPointsHistory.push({
          era: new BigNumber(era.toString()).toString(10),
          points,
        });
        if (validator.stakingLedger.claimedRewards.includes(era)) {
          eraPayoutState = "paid";
        } else {
          eraPayoutState = "pending";
        }
        // era performance
        const eraTotalStake = new BigNumber(
          erasExposure.find(
            // @ts-ignore
            (eraExposure) => eraExposure.era === era
          ).validators[stashAddress].total
        );
        const eraSelfStake = new BigNumber(
          erasExposure.find(
            // @ts-ignore
            (eraExposure) => eraExposure.era === era
          ).validators[stashAddress].own
        );
        const eraOthersStake = eraTotalStake.minus(eraSelfStake);
        stakeHistory.push({
          era: new BigNumber(era.toString()).toString(10),
          self: eraSelfStake.toString(10),
          others: eraOthersStake.toString(10),
          total: eraTotalStake.toString(10),
        });
        eraPerformance =
          (points * (1 - commission / 100)) /
          // token decimals of 10
          eraTotalStake.div(new BigNumber(10).pow(10)).toNumber();
        performanceHistory.push({
          era: new BigNumber(era.toString()).toString(10),
          performance: eraPerformance,
        });
      } else {
        // validator was not active in that era
        eraPointsHistory.push({
          era: new BigNumber(era.toString()).toString(10),
          points: 0,
        });
        stakeHistory.push({
          era: new BigNumber(era.toString()).toString(10),
          self: 0,
          others: 0,
          total: 0,
        });
        performanceHistory.push({
          era: new BigNumber(era.toString()).toString(10),
          performance: 0,
        });
      }
      payoutHistory.push({
        era: new BigNumber(era.toString()).toString(10),
        status: eraPayoutState,
      });
      // total performance
      performance += eraPerformance;
    });

    const eraPointsHistoryValidator = eraPointsHistory.reduce(
      // @ts-ignore
      (total, era) => total + era.points,
      0
    );
    const eraPointsHistoryTotals: any = [];
    erasPoints.forEach(({ eraPoints }: any) => {
      eraPointsHistoryTotals.push(parseInt(eraPoints.toString(), 10));
    });
    const eraPointsHistoryTotalsSum = eraPointsHistoryTotals.reduce(
      (total, num) => total + num,
      0
    );
    const numActiveValidators = validatorAddresses.length;

    const eraPointsAverage = eraPointsHistoryTotalsSum / numActiveValidators;

    const eraPointsPercent =
      (eraPointsHistoryValidator * 100) / eraPointsHistoryTotalsSum;
    const eraPointsRating =
      eraPointsHistoryValidator > eraPointsAverage ? 2 : 0;
    const payoutRating = getPayoutRating(payoutHistory);

    // stake
    const selfStake = active
      ? new BigNumber(validator.exposure.own.toString())
      : new BigNumber(validator.stakingLedger.total.toString());
    const totalStake = active
      ? new BigNumber(validator.exposure.total.toString())
      : selfStake;
    const otherStake = active ? totalStake.minus(selfStake) : new BigNumber(0);

    // performance
    if (performance > maxPerformance) {
      maxPerformance = performance;
    }
    if (performance < minPerformance) {
      minPerformance = performance;
    }

    const showClusterMember = true;

    const totalRating =
      activeRating +
      identityRating +
      subAccountsRating +
      nominatorsRating +
      commissionRating +
      eraPointsRating +
      slashRating +
      governanceRating +
      payoutRating;

    validatoRanking.active = active;
    validatoRanking.activeRating = activeRating;
    validatoRanking.name = name;
    validatoRanking.hasSubIdentity = hasSubIdentity;
    validatoRanking.subAccountsRating = subAccountsRating;
    validatoRanking.verifiedIdentity = verifiedIdentity;
    validatoRanking.identityRating = identityRating;
    validatoRanking.stashAddress = stashAddress;
    validatoRanking.controllerAddress = controllerAddress;
    validatoRanking.partOfCluster = partOfCluster;
    validatoRanking.clusterName = clusterName;
    validatoRanking.clusterMembers = clusterMembers;
    validatoRanking.showClusterMember = showClusterMember;
    validatoRanking.nominators = nominators;
    validatoRanking.nominatorsRating = nominatorsRating;
    validatoRanking.commission = commission;
    validatoRanking.commissionHistory = commissionHistory;
    validatoRanking.commissionRating = commissionRating;
    validatoRanking.activeEras = activeEras;
    validatoRanking.eraPointsHistory = eraPointsHistory;
    validatoRanking.eraPointsPercent = eraPointsPercent?.toString() || "";
    validatoRanking.eraPointsRating = eraPointsRating;
    validatoRanking.performance = performance;
    validatoRanking.performanceHistory = performanceHistory;
    validatoRanking.slashed = slashed;
    validatoRanking.slashRating = slashRating;
    validatoRanking.slashes = slashes;
    validatoRanking.councilBacking = councilBacking;
    validatoRanking.activeInGovernance = activeInGovernance;
    validatoRanking.governanceRating = governanceRating;
    validatoRanking.payoutHistory = payoutHistory;
    validatoRanking.selfStake = selfStake.toString();
    validatoRanking.otherStake = otherStake.toString();
    validatoRanking.totalStake = totalStake.toString();
    validatoRanking.stakeHistory = stakeHistory;
    validatoRanking.totalRating = totalRating;
    validatoRanking.identity = identity;

    validatoRanking.save();
  });
}
