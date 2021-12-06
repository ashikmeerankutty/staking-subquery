import { getSessionIndexes } from "./session";

function parseDetails(
  stashId: any,
  controllerIdOpt: any,
  nominatorsOpt: any,
  rewardDestination: any,
  validatorPrefs: any,
  exposure: any,
  stakingLedgerOpt: any
) {
  return {
    accountId: stashId,
    controllerId: controllerIdOpt && controllerIdOpt.unwrapOr(null),
    exposure,
    nominators: nominatorsOpt.isSome ? nominatorsOpt.unwrap().targets : [],
    rewardDestination,
    stakingLedger: stakingLedgerOpt.unwrapOrDefault(),
    stashId,
    validatorPrefs,
  };
}

export const getMultiLedgers = (ids: any, api: any) => {
  const ledgers = ids.map(async (id) => {
    return await api.query.staking.ledger(id)
  })
  return Promise.all(ledgers);
}

async function getLedgers(api: any, optIds: any, { withLedger = false }: any) {
  const ids = optIds
    .filter(
      // @ts-ignore
      (opt): opt => withLedger && !!opt && opt.isSome
    )
    // @ts-ignore
    .map((opt) => opt.unwrap());
  const emptyLed = api.registry.createType("Option<StakingLedger>");

  let optLedgers: any[] = [];

  if (ids.length) {
    optLedgers = await getMultiLedgers(ids, api);
  }
  let offset = -1;

  return optIds.map(
    // @ts-ignore
    (opt) => (opt && opt.isSome ? optLedgers[++offset] || emptyLed : emptyLed)
  );
}

export const getMulti = (ids: any, api: any) => {
  const multis = ids.map(async (id) => {
    return await api(id)
  })
  return Promise.all(multis);
}


export const getMultiEraStakers = (ids: any, api: any) => {
  const multis = ids.map(async (id) => {
    return await api(...id)
  })
  return Promise.all(multis);
}


async function getStashInfo(
  api: any,
  stashIds: any[],
  activeEra: any,
  {
    withController,
    withDestination,
    withExposure,
    withLedger,
    withNominations,
    withPrefs,
  }: any
) {
  const emptyNoms = await api.registry.createType("Option<Nominations>");
  const emptyRewa = await api.registry.createType("RewardDestination");
  const emptyExpo = await api.registry.createType("Exposure");
  const emptyPrefs = await api.registry.createType("ValidatorPrefs");

  // const bonded = stashIds.map(() => null);
  // const nominators = stashIds.map(() => emptyNoms);
  // const payee = stashIds.map(() => emptyRewa);
  // const validators = stashIds.map(() => emptyPrefs);
  // const erasStakers = stashIds.map(() => emptyExpo);

  const bonded =
    withController || withLedger
      ? await getMulti(stashIds, api.query.staking.bonded)
      : stashIds.map(() => null);
  const nominators = withNominations
    ? await getMulti(stashIds, api.query.staking.nominators)
    : stashIds.map(() => emptyNoms);
  const payee = withDestination
    ? await getMulti(stashIds, api.query.staking.payee)
    : stashIds.map(() => emptyRewa);
  const validators = withPrefs
    ? await getMulti(stashIds, api.query.staking.validators)
    : stashIds.map(() => emptyPrefs);
  const erasStakers = withExposure
    ? await getMultiEraStakers(stashIds.map((stashId) => [activeEra, stashId]), api.query.staking.erasStakers)
    : stashIds.map(() => emptyExpo);
  return [bonded, nominators, payee, validators, erasStakers];
}

async function getBatch(api: any, activeEra: any, stashIds: any[], flags: any) {
  const [
    controllerIdOpt,
    nominatorsOpt,
    rewardDestination,
    validatorPrefs,
    exposure,
  ] = await getStashInfo(api, stashIds, activeEra, flags);

  const stakingLedgerOpts = await getLedgers(api, controllerIdOpt, flags);

  const parsedDetails = stashIds.map(
    async (stashId, index) =>
      await parseDetails(
        stashId,
        controllerIdOpt[index],
        nominatorsOpt[index],
        rewardDestination[index],
        validatorPrefs[index],
        exposure[index],
        stakingLedgerOpts[index]
      )
  );

  return Promise.all(parsedDetails);
}

export async function accountQuery(
  accountId: Uint8Array | string,
  flags: any,
  api: any
) {
  const [first] = await accountQueryMulti([accountId], flags, api);
  return first;
}

export async function accountQueryMulti(
  accountIds: (Uint8Array | string)[],
  flags: any,
  api: any
) {
  if (accountIds.length) {
    const { activeEra } = await getSessionIndexes(api);
    const stashIds = await Promise.all(
      accountIds.map(
        async (accountId) =>
          await api.registry.createType("AccountId", accountId)
      )
    );

    return await getBatch(api, activeEra, stashIds, flags);
  }
  return [];
}
