import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import { PoolBalance, PoolBalanceFiveMinuteData } from "../../generated/schema"
import { putToken } from "./token/token"

export const putBalance = (
  poolId: string,
  token: Address,
  delta: BigInt,
): PoolBalance => {
  const entity = PoolBalance.load(
    poolId.concat("-").concat(token.toHexString()),
  )

  if (entity === null) {
    const entity = new PoolBalance(
      poolId.concat("-").concat(token.toHexString()),
    )

    entity.token = putToken(token).id
    entity.amount = delta
    entity.pool = poolId
    entity.save()
    return entity
  } else {
    entity.amount = entity.amount.plus(delta)
    entity.save()
    return entity
  }
}

export function updatePoolBalanceFiveMinuteData(
  event: ethereum.Event,
  updatedPoolBalance: PoolBalance,
): PoolBalanceFiveMinuteData {
  const timestamp = event.block.timestamp.toI32()
  const fiveMinuteIndex = timestamp / 300 // get unique hour within unix history
  const fiveMinuteStartUnix = fiveMinuteIndex * 300 // want the rounded effect
  const poolBalanceFiveMinuteID = updatedPoolBalance.id
    .concat("-")
    .concat(fiveMinuteIndex.toString())
  let poolBalanceFiveMinuteData = PoolBalanceFiveMinuteData.load(
    poolBalanceFiveMinuteID,
  )

  if (poolBalanceFiveMinuteData === null) {
    poolBalanceFiveMinuteData = new PoolBalanceFiveMinuteData(
      poolBalanceFiveMinuteID,
    )

    poolBalanceFiveMinuteData.periodStartUnix = fiveMinuteStartUnix
    poolBalanceFiveMinuteData.pool = updatedPoolBalance.pool
    poolBalanceFiveMinuteData.token = updatedPoolBalance.token
    poolBalanceFiveMinuteData.amount = updatedPoolBalance.amount
  } else {
    poolBalanceFiveMinuteData.amount = updatedPoolBalance.amount
  }

  poolBalanceFiveMinuteData.save()

  return poolBalanceFiveMinuteData as PoolBalanceFiveMinuteData
}
