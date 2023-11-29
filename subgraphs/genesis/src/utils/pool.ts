import { Address, Bytes } from "@graphprotocol/graph-ts"

import { Vault } from "../../generated/Vault/Vault"
import { Pool } from "../../generated/schema"
import { VAULT_ADDRESS } from "../constants"
import { putToken } from "./token/token"

export const putPool = (rawPoolId: Bytes): string => {
  let pool = Pool.load(rawPoolId.toHexString())

  if (pool == null) {
    pool = new Pool(rawPoolId.toHexString())

    const c_vault = Vault.bind(
      Address.fromBytes(Address.fromHexString(VAULT_ADDRESS))
    )

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
    pool.weights = null

    pool.save()
  }

  return rawPoolId.toHexString()
}
