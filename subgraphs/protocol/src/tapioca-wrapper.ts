import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts"

import { TOFT as TOFTContract } from "../generated/TapiocaWrapper/TOFT"
import { CreateOFT as CreateOFTEvent } from "../generated/TapiocaWrapper/TapiocaWrapper"
import { TOFT } from "../generated/templates"
import { getNetworkId } from "./utils/protocol/networks"
import { putToft } from "./utils/token/token"

export function handleCreateOFT(event: CreateOFTEvent): void {
  const currentNetworkId = getNetworkId(dataSource.network())
  const result = TOFTContract.bind(event.params._tapiocaOFT).try_hostChainID()

  if (result.reverted) {
    throw new Error("hostChainID is not available")
  } else {
    if (
      !BigInt.compare(BigInt.fromI32(currentNetworkId as i32), result.value)
    ) {
      putToft(event.params._tapiocaOFT, false, event.params._erc20)
    } else {
      putToft(event.params._tapiocaOFT, false)
    }
  }

  // * create TOFT template
  TOFT.create(Address.fromBytes(event.params._tapiocaOFT))
}
