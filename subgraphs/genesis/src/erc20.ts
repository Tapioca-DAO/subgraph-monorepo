import { Transfer as TransferEvent } from "../generated/LTAP/LTAP"
import { Pool } from "../generated/schema"
import { LBP_POOL_ID } from "./_config"
import { putUserTokenBalance } from "./utils/userTokenBalance"

export function handleTransfer(event: TransferEvent): void {
  const pool = Pool.load(LBP_POOL_ID)

  if (pool === null) {
    // we skip if pool is not set
    return
  }

  if (pool.swapEnabled === false) {
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
