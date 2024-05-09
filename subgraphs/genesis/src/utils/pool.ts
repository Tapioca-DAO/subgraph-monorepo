import { Address, Bytes, dataSource } from "@graphprotocol/graph-ts"

import { Vault } from "../../generated/Vault/Vault"
import { Pool } from "../../generated/schema"
import { putToken } from "./token/token"

const POOL_ID_CONTEXT_ID = "lbp_pool_id"

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

    dataSource.context().setString(POOL_ID_CONTEXT_ID, rawPoolId.toHexString())
  }

  return rawPoolId.toHexString()
}

export function getPoolId(): string | null {
  const data = dataSource.context().get(POOL_ID_CONTEXT_ID)

  if (data === null) {
    return null
  }

  return data.toString()
}
