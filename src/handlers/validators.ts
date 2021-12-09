export const getValidatorAddresses = async (api: any) => {
  return await api.query.staking.validators.keys();
};

export const getNominators = async (api: any) => {
  return await api.query.staking.nominators.entries();
};

export const getNominations = async (api: any) => {
  const nominators = await getNominators(api);
  // @ts-ignore
  return nominators.map(([key, nominations]) => {
    const nominator = key.toHuman()[0];
    const targets = nominations.toJSON()["targets"];
    return {
      nominator,
      targets,
    };
  });
};

