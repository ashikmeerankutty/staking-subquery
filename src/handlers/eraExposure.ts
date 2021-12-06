function mapStakers(
  era: any,
  stakers: any
) {
  const nominators: any = {};
  const validators: any = {};

  // @ts-ignore
  stakers.forEach(([key, exposure]): void => {
    const validatorId = key.args[1].toString();

    validators[validatorId] = exposure;

    // @ts-ignore
    exposure.others.forEach(({ who }, validatorIndex): void => {
      const nominatorId = who.toString();

      nominators[nominatorId] = nominators[nominatorId] || [];
      nominators[nominatorId].push({ validatorId, validatorIndex });
    });
  });

  return { era, nominators, validators };
}

export const getEraExposure = async (era: any, api: any) => {
  const stakers = await api.query.staking.erasStakersClipped.entries(era);
  const value = mapStakers(era, stakers);
  return value;
};
