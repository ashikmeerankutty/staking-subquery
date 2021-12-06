import { assertReturn, isU8a } from "@polkadot/util";
import { decodeAddress } from "@polkadot/util-crypto";

export async function indexToId (accountIndex: string, api: any) {
    if(api.query.indices) {
        const optResult = await api.query.indices.accounts(accountIndex)
        return optResult.unwrapOr([])[0];
    }
    return undefined;
  }


export async function retrieve(api: any, address: any) {
  const decoded = isU8a(address)
    ? address
    : decodeAddress((address || "").toString());

  if (decoded.length > 8) {
    return await api.registry.createType("AccountId", decoded);
  }

  const accountIndex = await api.registry.createType("AccountIndex", decoded);

  const accountId = await indexToId(accountIndex.toString(), api);

  return assertReturn(accountId, "Unable to retrieve accountId");
}

export function getAccountId(address: any, api: any) {
  return retrieve(api, address);
}
