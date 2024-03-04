import { BigInt, Bytes } from "@graphprotocol/graph-ts"

import {
  Transfer as TransferEvent,
  Mint as MintEvent,
} from "../generated/TOLP/TOLP"
import { TOLP, TOLPLockPosition } from "../generated/schema"
import { ZERO_ADDRESS_STRING } from "./utils/helper"

export function putTOLPEntity(nftId: BigInt): TOLP {
  let tolpEntity = TOLP.load(
    Bytes.fromHexString(Bytes.fromBigInt(nftId).toHexString())
  )

  if (tolpEntity == null) {
    tolpEntity = new TOLP(
      Bytes.fromHexString(Bytes.fromBigInt(nftId).toHexString())
    )
    tolpEntity.nftId = nftId
    tolpEntity.owner = ZERO_ADDRESS_STRING
    tolpEntity.save()
  }

  return tolpEntity
}

// We need to know who is the owner of the NFT
export function handleTransfer(event: TransferEvent): void {
  const tobEntity = putTOLPEntity(event.params.tokenId)
  tobEntity.owner = event.params.to.toHexString()
  tobEntity.save()
}

// `Mint` event happens only if we `lock`
export function handleMint(event: MintEvent): void {
  const tolpEntity = putTOLPEntity(event.params.tokenId)

  if (tolpEntity.owner === ZERO_ADDRESS_STRING) {
    throw new Error("[handleMint] - Owner is not set")
  }

  const tolpLockPositionEntity = new TOLPLockPosition(tolpEntity.id)
  tolpLockPositionEntity.sglAssetId = event.params.sglAssetID
  tolpLockPositionEntity.ybShares = event.params.ybShares
  tolpLockPositionEntity.lockTime = event.block.timestamp.toI32()
  tolpLockPositionEntity.lockDuration = event.params.lockDuration.toI32()
  tolpLockPositionEntity.tolp = tolpEntity.id
  tolpLockPositionEntity.save()

  tolpEntity.lockPosition = tolpLockPositionEntity.id

  tolpEntity.save()
}
