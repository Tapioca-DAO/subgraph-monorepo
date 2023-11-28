import {
  PoolBalanceChanged as PoolBalanceChangedEvent,
  Swap as SwapEvent,
} from "../generated/Vault/Vault"
import { putPool } from "./utils/pool"
import {
  putBalance,
  updatePoolBalanceFiveMinuteData,
} from "./utils/poolBalance"

export function handlePoolBalanceChanged(event: PoolBalanceChangedEvent): void {
  const poolId = putPool(event.params.poolId)

  for (let i = 0; i < event.params.tokens.length; i++) {
    const token = event.params.tokens[i]
    const delta = event.params.deltas[i]

    const poolBalance = putBalance(poolId, token, delta)
    updatePoolBalanceFiveMinuteData(event, poolBalance)
  }
}

export function handleSwap(event: SwapEvent): void {
  // * Note: pool should already exist when Swap event is emitted
  const tokenInBalance = putBalance(
    event.params.poolId.toHexString(),
    event.params.tokenIn,
    event.params.amountIn
  )
  updatePoolBalanceFiveMinuteData(event, tokenInBalance)

  const tokenOutBalance = putBalance(
    event.params.poolId.toHexString(),
    event.params.tokenOut,
    event.params.amountOut.neg()
  )

  updatePoolBalanceFiveMinuteData(event, tokenOutBalance)
}
