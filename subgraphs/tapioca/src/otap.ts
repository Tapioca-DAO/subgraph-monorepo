import { BigInt, Bytes } from "@graphprotocol/graph-ts"

import { Transfer as TransferEvent } from "../generated/OTAP/OTAP"
import { OTAP } from "../generated/schema"
import { ZERO_ADDRESS_STRING } from "./utils/helper"

export function putOTAPEntity(nftId: BigInt): OTAP {
  let tobEntity = OTAP.load(
    Bytes.fromHexString(Bytes.fromBigInt(nftId).toHexString())
  )

  if (tobEntity == null) {
    tobEntity = new OTAP(
      Bytes.fromHexString(Bytes.fromBigInt(nftId).toHexString())
    )
    tobEntity.nftId = nftId
    tobEntity.owner = ZERO_ADDRESS_STRING
    tobEntity.save()
  }

  return tobEntity
}

export function handleTransfer(event: TransferEvent): void {
  const tobEntity = putOTAPEntity(event.params.tokenId)
  tobEntity.owner = event.params.to.toHexString()
  tobEntity.save()
}
