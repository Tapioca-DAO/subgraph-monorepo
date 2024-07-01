import {
  OwnershipTransferred as OwnershipTransferredEvent,
  RegisterBigBang as RegisterBigBangEvent,
  RegisterSingularity as RegisterSingularityEvent,
} from "../generated/Penrose/Penrose"
import {
  BigBang as BigBangTemplate,
  Singularity as SingularityTemplate,
} from "../generated/templates"
import { createTapiocaProtocol } from "./utils/protocol/protocol"

export function handleRegisterSingularity(
  event: RegisterSingularityEvent,
): void {
  SingularityTemplate.create(event.params.location)
}

export function handleRegisterBigBang(event: RegisterBigBangEvent): void {
  BigBangTemplate.create(event.params.location)
}

export function handleDeploy(event: OwnershipTransferredEvent): void {
  // ! this will be called when contract is deployed ensuring that Tapioca Protocol is always present
  // and has penrose address
  createTapiocaProtocol(event.address)
}
