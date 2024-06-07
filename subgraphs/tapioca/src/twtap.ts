import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts"

import {
  Transfer as TransferEvent,
  Participate as ParticipateEvent,
  ExitPosition as ExitPositionEvent,
  AdvanceEpoch as AdvanceEpochEvent,
  AddRewardToken as AddRewardTokenEvent,
  SetMinWeightFactor as SetMinWeightFactorEvent,
  SetVirtualTotalAmount as SetVirtualTotalAmountEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent,
  TWTAP as TWTAPContract,
  ClaimReward as ClaimRewardEvent,
  DistributeReward as DistributeRewardEvent,
} from "../generated/TWTAP/TWTAP"
import {
  TWTAP,
  TWTAPLockPosition,
  TimeWeightedTapioca,
  TwTapEpoch,
  TwTapEpochRewardAmount,
  TwTapRewardToken,
} from "../generated/schema"
import { ZERO_ADDRESS_STRING } from "./utils/helper"
import { putToken } from "./utils/token/token"

function putTwTapEpochEntity(epochId: BigInt): TwTapEpoch {
  let twTapEpochEntity = TwTapEpoch.load(epochId.toString())

  if (twTapEpochEntity == null) {
    twTapEpochEntity = new TwTapEpoch(epochId.toString())
    twTapEpochEntity.epochId = epochId.toI32()
    twTapEpochEntity.lastDistributedRewardsTimestamp = 0
    twTapEpochEntity.save()
  }

  return twTapEpochEntity
}

function putTimeWeightedTapiocaEntity(): TimeWeightedTapioca {
  const twTapAddress = Address.fromBytes(
    Address.fromHexString(dataSource.context().getString("twtap_address")),
  )
  const ID = twTapAddress.toHexString()
  let twTapEntity = TimeWeightedTapioca.load(ID)

  if (twTapEntity == null) {
    const c_twtap = TWTAPContract.bind(twTapAddress)

    twTapEntity = new TimeWeightedTapioca(ID)
    twTapEntity.currentEpoch = putTwTapEpochEntity(
      c_twtap.lastProcessedWeek(),
    ).id
    twTapEntity.epochDuration = c_twtap.EPOCH_DURATION().toI32()
    twTapEntity.maxLockDuration = c_twtap.MAX_LOCK_DURATION().toU64()
    twTapEntity.epochesStartTime = c_twtap.creation().toI32()
    twTapEntity.virtualTotalAmount = BigInt.fromI32(10_000).pow(18) // c_twtap.VIRTUAL_TOTAL_AMOUNT()
    twTapEntity.minWeightFactor = BigInt.fromI32(1000) // c_twtap.MIN_WEIGHT_FACTOR()
    twTapEntity.isPaused = false
    twTapEntity.rewardTokens = []
    twTapEntity.save()
  }

  return twTapEntity
}

function putTWTAPEntity(nftId: BigInt): TWTAP {
  const ID = nftId.toString()
  let tobEntity = TWTAP.load(ID)

  if (tobEntity == null) {
    tobEntity = new TWTAP(ID)
    tobEntity.nftId = nftId
    tobEntity.owner = ZERO_ADDRESS_STRING
    tobEntity.save()
  }

  return tobEntity
}

function putTwTapEpochRewardAmountEntity(
  epochId: BigInt,
  rewardTokenId: BigInt,
): TwTapEpochRewardAmount {
  const ID = epochId.toString() + "-" + rewardTokenId.toString()
  let twTapRewardAmountEntity = TwTapEpochRewardAmount.load(ID)

  if (twTapRewardAmountEntity == null) {
    twTapRewardAmountEntity = new TwTapEpochRewardAmount(ID)
    twTapRewardAmountEntity.epoch = epochId.toString()
    twTapRewardAmountEntity.token = rewardTokenId.toString()
    twTapRewardAmountEntity.amount = BigInt.fromI32(0)
    twTapRewardAmountEntity.save()
  }

  return twTapRewardAmountEntity
}

export function handleTransfer(event: TransferEvent): void {
  const tobEntity = putTWTAPEntity(event.params.tokenId)
  tobEntity.owner = event.params.to.toHexString()
  tobEntity.save()
}

export function handleParticipate(event: ParticipateEvent): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()
  const twTapEntity = putTWTAPEntity(event.params.mintedTokenId)

  if (twTapEntity.owner === ZERO_ADDRESS_STRING) {
    throw new Error("[handleMint] - Owner is not set")
  }

  const twTapLockPositionEntity = new TWTAPLockPosition(twTapEntity.id)
  twTapLockPositionEntity.tapAmount = event.params.tapAmount
  twTapLockPositionEntity.multiplier = event.params.multiplier
  twTapLockPositionEntity.votingPowerAmount = event.params.multiplier.times(
    event.params.tapAmount,
  )
  twTapLockPositionEntity.lockTime = event.block.timestamp.toI32()
  twTapLockPositionEntity.lockDuration = event.params.lockDuration.toU64()
  twTapLockPositionEntity.lockedAtEpoch = twBaseEntity.currentEpoch
  twTapLockPositionEntity.lastActiveEpoch = putTwTapEpochEntity(
    event.block.timestamp
      .plus(event.params.lockDuration)
      .minus(BigInt.fromI32(twBaseEntity.epochesStartTime))
      .div(BigInt.fromI32(twBaseEntity.epochDuration)),
  ).id
  twTapLockPositionEntity.isExited = false
  twTapLockPositionEntity.lastClaimedTimestamp = 0
  twTapLockPositionEntity.twTap = twTapEntity.id

  twTapLockPositionEntity.save()

  twTapEntity.lockPosition = twTapLockPositionEntity.id
  twTapEntity.save()
}

export function handleExitPosition(event: ExitPositionEvent): void {
  const twTapEntity = putTWTAPEntity(event.params.twTapTokenId)
  const twTapLockPositionEntity = TWTAPLockPosition.load(twTapEntity.id)
  if (twTapLockPositionEntity == null) {
    throw new Error("[handleExitPosition] - Lock Position not found")
  }

  twTapLockPositionEntity.isExited = true
  twTapLockPositionEntity.save()
}

export function handleAdvanceEpoch(event: AdvanceEpochEvent): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()

  const latestEpochId = event.params.newEpoch.toI32()
  const currentEpochId = event.params.lastEpoch.toI32()

  for (let i = currentEpochId + 1; i <= latestEpochId; i++) {
    twBaseEntity.currentEpoch = putTwTapEpochEntity(BigInt.fromI32(i)).id
  }
  twBaseEntity.save()
}

export function handleAddRewardToken(event: AddRewardTokenEvent): void {
  const token = putToken(event.params.rewardTokenAddress)
  const twTapRewardTokenEntity = new TwTapRewardToken(
    event.params.rewardTokenIndex.toString(),
  )
  twTapRewardTokenEntity.tokenId = event.params.rewardTokenIndex.toI32()
  twTapRewardTokenEntity.token = token.id
  twTapRewardTokenEntity.save()

  const twBaseEntity = putTimeWeightedTapiocaEntity()
  const rewardTokens = twBaseEntity.rewardTokens
  rewardTokens.push(twTapRewardTokenEntity.id)
  twBaseEntity.rewardTokens = rewardTokens

  twBaseEntity.save()
}

export function handleSetMinWeightFactor(event: SetMinWeightFactorEvent): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()
  twBaseEntity.minWeightFactor = event.params.newMinWeightFactor
  twBaseEntity.save()
}

export function handleSetVirtualTotalAmount(
  event: SetVirtualTotalAmountEvent,
): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()
  twBaseEntity.virtualTotalAmount = event.params.newVirtualTotalAmount
  twBaseEntity.save()
}

export function handlePaused(event: PausedEvent): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()
  twBaseEntity.isPaused = true
  twBaseEntity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()
  twBaseEntity.isPaused = false
  twBaseEntity.save()
}

export function handleClaimReward(event: ClaimRewardEvent): void {
  const twTapEntity = putTWTAPEntity(event.params.twTapTokenId)
  const twTapLockPositionEntity = TWTAPLockPosition.load(twTapEntity.id)
  if (twTapLockPositionEntity == null) {
    throw new Error("[handleClaimReward] - Lock Position not found")
  }

  twTapLockPositionEntity.lastClaimedTimestamp = event.block.timestamp.toI32()
  twTapLockPositionEntity.save()
}

export function handleDistributeReward(event: DistributeRewardEvent): void {
  const twBaseEntity = putTimeWeightedTapiocaEntity()
  const currentEpoch = putTwTapEpochEntity(
    BigInt.fromString(twBaseEntity.currentEpoch),
  )
  currentEpoch.lastDistributedRewardsTimestamp = event.block.timestamp.toI32()
  currentEpoch.save()

  const twTapRewardAmountEntity = putTwTapEpochRewardAmountEntity(
    BigInt.fromString(twBaseEntity.currentEpoch),
    event.params.rewardTokenIndex,
  )

  twTapRewardAmountEntity.amount = twTapRewardAmountEntity.amount.plus(
    event.params.amount,
  )

  twTapRewardAmountEntity.save()

  twBaseEntity.save()
}
