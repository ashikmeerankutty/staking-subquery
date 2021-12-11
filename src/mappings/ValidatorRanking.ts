import { getErasPoints } from "../handlers/erasPoints";
import { getProposals } from "../handlers/proposals";
import { getReferendums } from "../handlers/referendums";
import {
  getEraHistoric,
  getEraPrefs,
  getEraSlashes,
} from "../handlers/staking";
import { getValidatorAddresses } from "../handlers/validators";
import { geVotes } from "../handlers/votes";
import {
  ValidatorsInfo,
  CouncilVotes,
  EraPoints,
  EraPreferences,
  EraSlashes,
  MaxNominatorRewardedPerValidator,
  Nomination,
  Proposal,
  Referendum,
} from "../types";


export async function handleValidatorAddress(): Promise<void> {
  const validatorAddresses = await getValidatorAddresses(api);

  for (let i = 0; i < validatorAddresses.length; i++) {
    const authorityId = validatorAddresses[i];
    const validatorInfo = new ValidatorsInfo(authorityId.toString());
    validatorInfo.accountId = authorityId.toString();
    await validatorInfo.save();
  }
}

export async function handleEraSlashes() {
  const erasHistoric = await getEraHistoric(api, false);
  const eraIndexes = erasHistoric.slice(
    // 84 days history
    Math.max(erasHistoric.length - 84, 0)
  );

  for (const eraIndex of eraIndexes) {
    const eraSlashes = await getEraSlashes(api, eraIndex);
    const eraSlash = new EraSlashes(eraSlashes.era.toString());
    eraSlash.validators = JSON.stringify(eraSlashes.validators);
    await eraSlash.save();
  }

  for (const eraIndex of eraIndexes) {
    const eraPrefs = await getEraPrefs(api, eraIndex);
    const eraPreference = new EraPreferences(eraPrefs.era.toString());
    eraPreference.validators = JSON.stringify(eraPrefs.validators);
    await eraPreference.save();
  }

  const erasPoints = await getErasPoints(eraIndexes, api);
  for (const erasPoint of erasPoints) {
    const eraPoints = new EraPoints(erasPoint.era.toString());
    eraPoints.eraPoints = erasPoint.eraPoints.toString();
    eraPoints.validators = JSON.stringify(erasPoint.validators);
    await eraPoints.save();
  }
}

export async function handleEraPrefs() {
  const erasHistoric = await getEraHistoric(api, false);
  const eraIndexes = erasHistoric.slice(
    // 84 days history
    Math.max(erasHistoric.length - 84, 0)
  );

  for (const eraIndex of eraIndexes) {
    const eraPrefs = await getEraPrefs(api, eraIndex);
    const eraPreference = new EraPreferences(eraPrefs.era.toString());
    eraPreference.validators = JSON.stringify(eraPrefs.validators);
    await eraPreference.save();
  }
}

export async function handleEraPoints() {
  const erasHistoric = await getEraHistoric(api, false);
  const eraIndexes = erasHistoric.slice(
    // 84 days history
    Math.max(erasHistoric.length - 84, 0)
  );

  const erasPoints = await getErasPoints(eraIndexes, api);
  for (const erasPoint of erasPoints) {
    const eraPoints = new EraPoints(erasPoint.era.toString());
    eraPoints.eraPoints = erasPoint.eraPoints.toString();
    eraPoints.validators = JSON.stringify(erasPoint.validators);
    await eraPoints.save();
  }
}

export async function handleCouncilVotes() {
  const councilVotes = await geVotes(api);
  for (const councilVote of councilVotes) {
    const [id, data] = councilVote;
    const { stake, votes } = data;
    const councilVoteEntity = new CouncilVotes(id.toString());
    councilVoteEntity.stake = stake.toString();
    councilVoteEntity.votes = votes as unknown as string[];
    await councilVoteEntity.save();
  }
}

export async function handleReferendums() {
  const referendums = await getReferendums(api);
  for (const referendum of referendums) {
    const { votes, index } = referendum;
    const referendumEntity = new Referendum(index.toString());
    referendumEntity.votes = votes;
    await referendumEntity.save();
  }
}

export async function handleProposals() {
  const proposals = await getProposals(api);
  for (const proposal of proposals) {
    const { seconds, proposer } = proposal;
    const proposalEntity = new Proposal(proposer.toString());
    proposalEntity.proposer = proposer.toString();
    proposalEntity.seconds = seconds;
    await proposalEntity.save();
  }
}

export async function handleNominations() {
  const nominatorsGlobal = await api.query.staking.nominators.entries();
  for (const nomination of nominatorsGlobal) {
    const [key, nominations] = nomination;
    const nominator = key.toHuman()[0];
    const targets = nominations.toJSON()["targets"];
    const nominatorEntity = new Nomination(nominator);
    nominatorEntity.nominator = nominator;
    nominatorEntity.targets = targets;
    await nominatorEntity.save();
  }
}

export async function handleMaxNominatorRewardedPerValidator() {
  const { maxNominatorRewardedPerValidator } = await api.consts.staking;
  const maxNominatorRewardedPerValidatorEnity =
    new MaxNominatorRewardedPerValidator("1");
  maxNominatorRewardedPerValidatorEnity.maxNominatorRewardedPerValidator =
    maxNominatorRewardedPerValidator.toNumber();
  await maxNominatorRewardedPerValidatorEnity.save();
}
