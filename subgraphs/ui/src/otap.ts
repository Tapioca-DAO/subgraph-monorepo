import { BigInt, Bytes } from "@graphprotocol/graph-ts"

import { Transfer as TransferEvent } from "../generated/OTAP/OTAP"
import { oTAP } from "../generated/schema"

function putOTAPEntity(nftId: BigInt): oTAP {
  let tobEntity = oTAP.load(
    Bytes.fromHexString(Bytes.fromBigInt(nftId).toHexString())
  )

  if (tobEntity == null) {
    tobEntity = new oTAP(
      Bytes.fromHexString(Bytes.fromBigInt(nftId).toHexString())
    )
    tobEntity.nftId = nftId
    tobEntity.owner = "0x0000000000000000000000000000000000000000"
    tobEntity.save()
  }

  return tobEntity
}

export function handleTransfer(event: TransferEvent): void {
  const tobEntity = putOTAPEntity(event.params.tokenId)
  tobEntity.owner = event.params.to.toHexString()
  tobEntity.save()
}
