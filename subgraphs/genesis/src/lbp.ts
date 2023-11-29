import {
  GradualWeightUpdateScheduled as GradualWeightUpdateScheduledEvent,
  LBP,
} from "../generated/LBP/LBP"
import { Pool, PoolWeights } from "../generated/schema"
import { putPool } from "./utils/pool"

export function handleGradualWeightUpdateScheduled(
  event: GradualWeightUpdateScheduledEvent
): void {
  const c_lbp = LBP.bind(event.address)

  const _poolId = c_lbp.try_getPoolId()

  if (_poolId.reverted) {
    throw new Error("poolId reverted")
  }

  const poolId = putPool(_poolId.value)

  let entity = PoolWeights.load(poolId)

  if (entity === null) {
    entity = new PoolWeights(poolId)
  }

  entity.startTimestamp = event.params.startTime.toI32()
  entity.endTimestamp = event.params.endTime.toI32()

  entity.startWeights = event.params.startWeights
  entity.endWeights = event.params.endWeights

  entity.pool = poolId

  entity.save()

  const pool = Pool.load(poolId)

  if (pool === null) {
    throw new Error("pool is null")
  }

  pool.weights = entity.id

  pool.save()
}
