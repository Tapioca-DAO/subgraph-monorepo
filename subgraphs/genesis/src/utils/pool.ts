import { Address, BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts"

import { Vault } from "../../generated/Vault/Vault"
import { Pool, PoolWeights, SimplePostSwapPool } from "../../generated/schema"
import { putToken } from "./token/token"

export const putPool = (rawPoolId: Bytes): string => {
  let pool = Pool.load(rawPoolId.toHexString())

  if (pool === null) {
    pool = new Pool(rawPoolId.toHexString())

    const vaultAddress = Address.fromBytes(
      Address.fromHexString(dataSource.context().getString("vault_address"))
    )
    const c_vault = Vault.bind(vaultAddress)

    const poolTokens = c_vault.try_getPoolTokens(rawPoolId)

    if (poolTokens.reverted) {
      throw new Error("Failed to get pool tokens")
    }

    const tokens = poolTokens.value.getTokens()

    const tokenIds: string[] = []
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      tokenIds.push(putToken(token).id)
    }

    pool.tokens = tokenIds
    pool.swapEnabled = false
    pool.weights = null

    pool.save()
  }

  return rawPoolId.toHexString()
}

export const createPostSwapPool = (
  rawPoolId: Bytes,
  blockTimestampUnix: BigInt
): string | null => {
  const poolId = rawPoolId.toHexString()
  const pool = Pool.load(poolId)

  if (pool !== null && pool.weights !== null) {
    const weights = PoolWeights.load(pool.weights as string)
    if (weights == null) {
      return null
    }

    if (weights.endTimestamp >= blockTimestampUnix.toI32()) {
      return null
    }
    let postSwapPool = SimplePostSwapPool.load(poolId)
    if (postSwapPool === null) {
      postSwapPool = new SimplePostSwapPool(poolId)
      postSwapPool.tokens = pool.tokens
    }

    postSwapPool.timestampUnix = blockTimestampUnix.toI32()

    const currentPoolBalances = pool.balances.load()
    const poolBalances: BigInt[] = []
    // there should always be the same number of balances as tokens
    // if not we fill 0 as the balance
    for (let i = 0; i < pool.tokens.length; i++) {
      let _bal = BigInt.fromI32(0)
      if (currentPoolBalances.length - 1 >= i) {
        _bal = currentPoolBalances[i].amount
      }

      poolBalances.push(_bal)
    }

    postSwapPool.balances = poolBalances

    postSwapPool.save()
  } else {
    return null
  }

  return rawPoolId.toHexString()
}
