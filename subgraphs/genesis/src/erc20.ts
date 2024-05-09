import { Transfer as TransferEvent } from "../generated/LTAP/LTAP"
import { Pool } from "../generated/schema"
import { getPoolId } from "./utils/pool"
import { putUserTokenBalance } from "./utils/userTokenBalance"

export function handleTransfer(event: TransferEvent): void {
  const poolId = getPoolId()
  if (poolId === null) {
    // we skip if pool is not set
    return
  }

  const pool = Pool.load(poolId as string)

  if (pool === null) {
    // we skip if pool is not set
    return
  }

  if (pool.swapEnabled == false) {
    // we skip if swap is not enabled
    return
  }

  putUserTokenBalance(
    event.address,
    event.params.value.neg(),
    event.params.from
  )
  putUserTokenBalance(event.address, event.params.value, event.params.to)
}
