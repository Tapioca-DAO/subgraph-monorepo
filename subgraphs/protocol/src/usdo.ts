import { OwnershipTransferred as OwnershipTransferredEventUSDO } from "../generated/USDO/USDO"
import {
  SetTrustedRemote as SetTrustedRemoteEventToft,
  ReceiveFromChain as ReceiveFromChainEventToft,
} from "../generated/templates/TOFT/TOFT"
import {
  handleSetTrustedRemoteTofts,
  handleReceiveFromChainTofts,
} from "./common/tofts"
import { putToft } from "./utils/token/token"

export function handleSetTrustedRemote(event: SetTrustedRemoteEventToft): void {
  handleSetTrustedRemoteTofts(event)
}

export function handleReceiveFromChain(event: ReceiveFromChainEventToft): void {
  handleReceiveFromChainTofts(event)
}

export function handleDeploy(event: OwnershipTransferredEventUSDO): void {
  // ! this will be called when contract is deployed ensuring that USDO is always present
  putToft(event.address, true)
}
