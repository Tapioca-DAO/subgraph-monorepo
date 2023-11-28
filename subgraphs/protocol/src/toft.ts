import {
  SetTrustedRemote as SetTrustedRemoteEvent,
  ReceiveFromChain as ReceiveFromChainEvent,
} from "../generated/templates/TOFT/TOFT"
import {
  handleSetTrustedRemoteTofts,
  handleReceiveFromChainTofts,
} from "./common/tofts"

export function handleSetTrustedRemote(event: SetTrustedRemoteEvent): void {
  handleSetTrustedRemoteTofts(event)
}

export function handleReceiveFromChain(event: ReceiveFromChainEvent): void {
  handleReceiveFromChainTofts(event)
}
