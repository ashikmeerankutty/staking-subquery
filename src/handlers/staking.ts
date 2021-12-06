import { BN_ONE, BN_ZERO } from "@polkadot/util";

export const getEraHistoric = async (api: any, withActive?: boolean) => {
  const [activeEraOpt, historyDepth] = await api.queryMulti([
    api.query.staking.activeEra,
    api.query.staking.historyDepth,
  ]);

  // @ts-ignore
  const result = [];
  const max = historyDepth.toNumber();
  const activeEra = activeEraOpt.unwrapOrDefault().index;
  let lastEra = activeEra;

  while (lastEra.gte(BN_ZERO) && result.length < max) {
    if (lastEra !== activeEra || withActive === true) {
      result.push(api.registry.createType("EraIndex", lastEra));
    }

    lastEra = lastEra.sub(BN_ONE);
  }

  // go from oldest to newest
  return result.reverse();
};

function mapSlashes(era: any, noms: any, vals: any) {
  const nominators = {};
  const validators = {};

  // @ts-ignore
  noms.forEach(([key, optBalance]): void => {
    // @ts-ignore
    nominators[key.args[1].toString()] = optBalance.unwrap();
  });

  // @ts-ignore
  vals.forEach(([key, optRes]): void => {
    // @ts-ignore
    validators[key.args[1].toString()] = optRes.unwrapOrDefault()[1];
  });

  return { era, nominators, validators };
}

export const getEraSlashes = async (api: any, era: any) => {
  const noms = await api.query.staking.nominatorSlashInEra.entries(era);
  const vals = await api.query.staking.validatorSlashInEra.entries(era);

  const value = mapSlashes(era, noms, vals);

  return value;
};

function mapPrefs(era: any, prefs: any) {
  const validators = {};

  // @ts-ignore
  prefs.forEach(([key, prefs]): void => {
    // @ts-ignore
    validators[key.args[1].toString()] = prefs;
  });
  

  return { era, validators };
}

export const getEraPrefs = async (api: any, era: any) => {
  const prefs = await api.query.staking.erasValidatorPrefs.entries(era);
  const value = mapPrefs(era, prefs);
  return value;
};