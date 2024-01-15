import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts"

import { TOFT as TOFTContract } from "../generated/TapiocaWrapper/TOFT"
import { CreateOFT as CreateOFTEvent } from "../generated/TapiocaWrapper/TapiocaWrapper"
import { TOFToken } from "../generated/schema"
import { TOFT } from "../generated/templates"
import { getNetworkId } from "./utils/networks/definition"
import { putToken } from "./utils/token/token"

export function handleCreateOFT(event: CreateOFTEvent): void {
  const toftEntity = new TOFToken(event.params._tapiocaOFT)

  toftEntity.token = putToken(event.params._tapiocaOFT).id

  toftEntity.remoteTOFTs = []

  const currentNetworkId = getNetworkId(dataSource.network())
  const result = TOFTContract.bind(event.params._tapiocaOFT).try_hostChainID()

  if (result.reverted) {
    throw new Error("hostChainID is not available")
  } else {
    if (
      !BigInt.compare(BigInt.fromI32(currentNetworkId as i32), result.value)
    ) {
      toftEntity.underlyingToken = putToken(event.params._erc20).id
    }
  }

  toftEntity.save()

  TOFT.create(Address.fromBytes(event.params._tapiocaOFT))
}
