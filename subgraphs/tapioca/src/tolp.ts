import {
  Address,
  BigInt,
  Bytes,
  dataSource,
  store,
} from "@graphprotocol/graph-ts"

import {
  Transfer as TransferEvent,
  Mint as MintEvent,
  Burn as BurnEvent,
  RegisterSingularity as RegisterSingularityEvent,
  UnregisterSingularity as UnregisterSingularityEvent,
  SetSGLPoolWeight as SetSGLPoolWeightEvent,
  UpdateTotalSingularityPoolWeights as UpdateTotalSingularityPoolWeightsEvent,
  ActivateSGLPoolRescue as ActivateSGLPoolRescueEvent,
} from "../generated/TOLP/TOLP"
import {
  TOLP,
  TOLPLockPosition,
  TapiocaOptionLiquidityProvision,
  TolpSingularityPool,
} from "../generated/schema"
import { putTobEntity } from "./tob"
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

export function putTapiocaOptionLiquidityProvisionEntity(): TapiocaOptionLiquidityProvision {
  const tolpAddress = Address.fromHexString(
    dataSource.context().getString("tolp_address")
  )
  let tolpEntity = TapiocaOptionLiquidityProvision.load(tolpAddress)

  if (tolpEntity == null) {
    tolpEntity = new TapiocaOptionLiquidityProvision(tolpAddress)
    tolpEntity.totalSingularityPoolWeights = BigInt.fromI32(0)
    tolpEntity.singularityPools = []
    tolpEntity.save()
  }

  return tolpEntity
}

export function putTolpSingularityPool(
  sglAssetId: BigInt,
  sglAddress: Address,
  weight: BigInt
): TolpSingularityPool {
  let tolpSglPoolEntity = TolpSingularityPool.load(sglAssetId.toString())

  if (tolpSglPoolEntity == null) {
    tolpSglPoolEntity = new TolpSingularityPool(sglAssetId.toString())
    tolpSglPoolEntity.sglAssetId = sglAssetId
    tolpSglPoolEntity.sglAddress = sglAddress.toHexString()
    tolpSglPoolEntity.poolWeight = weight
    tolpSglPoolEntity.totalDeposited = BigInt.fromI32(0)
    tolpSglPoolEntity.isInRescueMode = false
    tolpSglPoolEntity.currentEpochTapAmount = BigInt.fromI32(0)
    tolpSglPoolEntity.save()

    const tolpEntity = putTapiocaOptionLiquidityProvisionEntity()

    const sglPools = tolpEntity.singularityPools
    sglPools.push(tolpSglPoolEntity.id)
    tolpEntity.singularityPools = sglPools

    tolpEntity.save()
  }

  return tolpSglPoolEntity
}

export function getTolpSingularityPool(
  sglAssetId: BigInt
): TolpSingularityPool {
  const tolpSglPoolEntity = TolpSingularityPool.load(sglAssetId.toString())

  if (tolpSglPoolEntity == null) {
    throw new Error("[getTolpSingularityPool] - Singularity Pool not found")
  }

  return tolpSglPoolEntity
}

// We need to know who is the owner of the NFT
export function handleRegisterSingularity(
  event: RegisterSingularityEvent
): void {
  putTolpSingularityPool(
    event.params.sglAssetId,
    event.params.sglAddress,
    event.params.poolWeight
  )
}

export function handleUnregisterSingularity(
  event: UnregisterSingularityEvent
): void {
  const tolpSglPoolEntityId = event.params.sglAssetId.toString()
  const tolpEntity = putTapiocaOptionLiquidityProvisionEntity()

  const sglPools = tolpEntity.singularityPools
  for (let i = 0; i < sglPools.length; i++) {
    const sglPoolId = sglPools[i]

    if (sglPoolId === tolpSglPoolEntityId) {
      sglPools.splice(i, 1)
      break
    }
  }

  tolpEntity.singularityPools = sglPools

  tolpEntity.save()

  store.remove("TolpSingularityPool", event.params.sglAssetId.toString())
}

export function handleActivateSGLPoolRescue(
  event: ActivateSGLPoolRescueEvent
): void {
  const tolpSingularityPoolEntity = getTolpSingularityPool(
    event.params.sglAssetId
  )
  tolpSingularityPoolEntity.isInRescueMode = true
  tolpSingularityPoolEntity.save()
}

export function handleSetSGLPoolWeight(event: SetSGLPoolWeightEvent): void {
  const tolpSingularityPoolEntity = getTolpSingularityPool(
    event.params.sglAssetId
  )
  tolpSingularityPoolEntity.poolWeight = event.params.poolWeight
  tolpSingularityPoolEntity.save()
}

export function handleUpdateTotalSingularityPoolWeights(
  event: UpdateTotalSingularityPoolWeightsEvent
): void {
  const tolpEntity = putTapiocaOptionLiquidityProvisionEntity()
  tolpEntity.totalSingularityPoolWeights =
    event.params.totalSingularityPoolWeights

  tolpEntity.save()
}

// We need to know who is the owner of the NFT
export function handleTransfer(event: TransferEvent): void {
  const tobEntity = putTOLPEntity(event.params.tokenId)
  tobEntity.owner = event.params.to.toHexString()
  tobEntity.save()
}

// `Mint` event happens only if we `lock`
export function handleMint(event: MintEvent): void {
  const tolpEntity = putTOLPEntity(event.params.tolpTokenId)

  if (tolpEntity.owner === ZERO_ADDRESS_STRING) {
    throw new Error("[handleMint] - Owner is not set")
  }

  const tolpLockPositionEntity = new TOLPLockPosition(tolpEntity.id)
  tolpLockPositionEntity.sglAssetId = event.params.sglAssetId
  tolpLockPositionEntity.ybShares = event.params.ybShares
  tolpLockPositionEntity.lockTime = event.block.timestamp.toI32()
  tolpLockPositionEntity.lockDuration = event.params.lockDuration.toI32()
  tolpLockPositionEntity.sglAddress = event.params.sglAddress.toHexString()
  tolpLockPositionEntity.tolp = tolpEntity.id
  tolpLockPositionEntity.lockedAtEpoch = putTobEntity().currentEpoch
  tolpLockPositionEntity.tolpSingularityPool = getTolpSingularityPool(
    event.params.sglAssetId
  ).id
  tolpLockPositionEntity.save()

  tolpEntity.lockPosition = tolpLockPositionEntity.id

  tolpEntity.save()

  const tolpSglPoolEntity = getTolpSingularityPool(event.params.sglAssetId)

  tolpSglPoolEntity.totalDeposited = tolpSglPoolEntity.totalDeposited.plus(
    event.params.ybShares
  )

  tolpSglPoolEntity.save()
}

// `Mint` event happens only if we `unlock`
export function handleBurn(event: BurnEvent): void {
  const tolpEntity = putTOLPEntity(event.params.tolpTokenId)

  const tolpLockPositionEntity = TOLPLockPosition.load(tolpEntity.id)

  if (tolpEntity.owner === ZERO_ADDRESS_STRING) {
    throw new Error("[handleBurn] - Owner is not set")
  }

  if (tolpLockPositionEntity == null) {
    throw new Error("[handleBurn] - Lock Position not found")
  }

  tolpEntity.lockPosition = null

  tolpEntity.save()

  const tolpSglPoolEntity = getTolpSingularityPool(event.params.sglAssetId)

  tolpSglPoolEntity.totalDeposited = tolpSglPoolEntity.totalDeposited.minus(
    tolpLockPositionEntity.ybShares
  )

  tolpSglPoolEntity.save()

  store.remove("TOLPLockPosition", tolpEntity.id.toHexString())
}
