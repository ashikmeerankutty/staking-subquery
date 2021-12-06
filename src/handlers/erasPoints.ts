import { BN_ZERO } from "@polkadot/util";

const mapValidators = ({ individual }: any) => {
  return [...individual.entries()]
    .filter(([, points]) => points.gt(BN_ZERO))
    .reduce((result: any, [validatorId, points]) => {
      result[validatorId.toString()] = points;

      return result;
    }, {});
};

function mapPoints(eras: any[], points: any[]): any[] {
  return eras.map((era, index): any => ({
    era,
    eraPoints: points[index].total,
    validators: mapValidators(points[index]),
  }));
}

export const getMultiErasRewardPoints = (eras: any, api: any) => {
  const points = eras.map(async (era) => {
    return await api.query.staking.erasRewardPoints(era)
  })
  return Promise.all(points);
}

export const getErasPoints = async (eras: any, api: any) => {
  if (eras.length) {
    const points = await getMultiErasRewardPoints(eras, api);
    const query = mapPoints(eras, points);
    return eras.map((era: any) =>
      query.find((query: any) => era.eq(query.era))
    );
  }
  return [];
};
