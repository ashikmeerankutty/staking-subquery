import { BN, bnSqrt, isFunction } from "@polkadot/util";

export async function zeroBalance(api: any) {
  return await api.registry.createType("Balance");
}

function getBalance(
  api: any,
  [freeBalance, reservedBalance, frozenFee, frozenMisc]: any
): any {
  const votingBalance = api.registry.createType("Balance", freeBalance.toBn());

  return {
    freeBalance,
    frozenFee,
    frozenMisc,
    reservedBalance,
    votingBalance,
  };
}

export async function calcBalances(
  api: any,
  [accountId, [accountNonce, [primary, ...additional]]]: any
) {
  return {
    accountId,
    accountNonce,
    additional: additional.map((b: any) => getBalance(api, b)),
    ...getBalance(api, primary),
  };
}

// old
export async function queryBalancesFree(api: any, accountId: any) {
  const [freeBalance, reservedBalance, accountNonce] = await api.queryMulti([
    [api.query.balances.freeBalance, accountId],
    [api.query.balances.reservedBalance, accountId],
    [api.query.system.accountNonce, accountId],
  ]);
  return [
    accountNonce,
    [[freeBalance, reservedBalance, zeroBalance(api), zeroBalance(api)]],
  ];
}

export async function queryNonceOnly(api: any, accountId: any) {
  const fill = async (nonce: any) => {
    const zeroB = await zeroBalance(api);
    return [nonce, [[zeroB, zeroB, zeroB, zeroB]]];
  };

  if (isFunction(api.query.system.account)) {
    const { nonce } = await api.query.system.account(accountId);
    return fill(nonce);
  } else if (isFunction(api.query.system.accountNonce)) {
    const nonce = await api.query.system.accountNonce(accountId);
    return fill(nonce);
  }
  const nonce = await fill(api.registry.createType("Index"));
  return fill(nonce);
}

export async function queryBalancesAccount(
  api: any,
  accountId: any,
  modules: string[] = ["balances"]
) {
  const balances = await modules
    .map((m) => api.query[m]?.account)
    .filter((q) => isFunction(q))
    .map((q) => [q, accountId]);

  const extract = (nonce: any, data: any): any => [
    nonce,
    data.map(
      // @ts-ignore
      ({ feeFrozen, free, miscFrozen, reserved }) => [
        free,
        reserved,
        feeFrozen,
        miscFrozen,
      ]
    ),
  ];

  if (balances.length) {
    if (isFunction(api.query.system.account)) {
      const [{ nonce }] = api.queryMulti([
        [api.query.system.account, accountId],
        ...balances,
      ]);
      return extract(nonce, balances);
    }
    const [nonce] = api.queryMulti([
      [api.query.system.accountNonce, accountId],
      ...balances,
    ]);
    return extract(nonce, balances);
  }

  return queryNonceOnly(api, accountId);
}

export async function querySystemAccount(api: any, accountId: any) {
  // AccountInfo is current, support old, eg. Edgeware

  const infoOrtuple = await api.query.system.account(accountId);
  const data = infoOrtuple.nonce ? infoOrtuple.data : infoOrtuple[1];
  const nonce = infoOrtuple.nonce ? infoOrtuple.nonce : infoOrtuple[0];

  if (!data || data.isEmpty) {
    return [
      nonce,
      [
        [
          zeroBalance(api),
          zeroBalance(api),
          zeroBalance(api),
          zeroBalance(api),
        ],
      ],
    ];
  }
  const { feeFrozen, free, miscFrozen, reserved } = data;

  return [nonce, [[free, reserved, feeFrozen, miscFrozen]]];
}
