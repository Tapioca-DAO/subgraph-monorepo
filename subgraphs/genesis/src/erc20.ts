import { Transfer as TransferEvent } from "../generated/LTAP/LTAP"
import { putUserTokenBalance } from "./utils/userTokenBalance"

export function handleTransfer(event: TransferEvent): void {
  putUserTokenBalance(
    event.address,
    event.params.value.neg(),
    event.params.from
  )
  putUserTokenBalance(event.address, event.params.value, event.params.to)
}
