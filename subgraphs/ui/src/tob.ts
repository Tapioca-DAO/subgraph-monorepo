import {
  Address,
  BigInt,
  Bytes,
  dataSource,
  store,
} from "@graphprotocol/graph-ts"

import {
  SetPaymentToken as SetPaymentTokenEvent,
  NewEpoch as NewEpochEvent,
  TOB,
  Participate as ParticipateEvent,
  ExitPosition as ExitPositionEvent,
  ExerciseOption as ExerciseOptionEvent,
} from "../generated/TOB/TOB"
import {
  TapiocaOptionBrokerPaymentToken,
  TapiocaOptionBroker,
  TapiocaOptionBrokerEpoch,
  OTAPParticipatePosition,
} from "../generated/schema"
import { putOTAPEntity } from "./otap"
import {
  getTolpSingularityPool,
  putTOLPEntity,
  putTapiocaOptionLiquidityProvisionEntity,
} from "./tolp"
import { putToken } from "./utils/token/token"

function putEpochEntity(
  epochId: BigInt,
  epochTAPAmount: BigInt,
  epochTAPValuation: BigInt
): TapiocaOptionBrokerEpoch {
  const tobEntity = new TapiocaOptionBrokerEpoch(epochId.toString())

  tobEntity.epochId = epochId
  tobEntity.epochTAPAmount = epochTAPAmount
  tobEntity.epochTAPValuation = epochTAPValuation
  tobEntity.save()

  return tobEntity
}

export function putTobEntity(): TapiocaOptionBroker {
  const tobAddress = Address.fromBytes(
    Address.fromHexString(dataSource.context().getString("tob_address"))
  )
  let tobEntity = TapiocaOptionBroker.load(tobAddress)

  if (tobEntity == null) {
    tobEntity = new TapiocaOptionBroker(tobAddress)
    const tobContract = TOB.bind(tobAddress)

    tobEntity.paymentTokens = []
    tobEntity.epochDuration = tobContract.EPOCH_DURATION().toI32()
    tobEntity.tap = putToken(tobContract.tapOFT()).id
    tobEntity.currentEpoch = putEpochEntity(
      BigInt.fromU32(0),
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    ).id
    tobEntity.save()
  }

  return tobEntity
}

function putPaymentToken(
  tokenId: Bytes,
  oracleAddress: Address,
  oracleData: Bytes
): TapiocaOptionBrokerPaymentToken {
  let paymentTokenEntity = TapiocaOptionBrokerPaymentToken.load(tokenId)

  if (paymentTokenEntity == null) {
    paymentTokenEntity = new TapiocaOptionBrokerPaymentToken(tokenId)
  }

  paymentTokenEntity.token = tokenId
  paymentTokenEntity.oracleAddress = oracleAddress.toHexString()
  paymentTokenEntity.oracleData = oracleData
  paymentTokenEntity.save()

  return paymentTokenEntity
}

export function handleSetPaymentToken(event: SetPaymentTokenEvent): void {
  const tobEntity = putTobEntity()

  const token = putToken(event.params.paymentToken)

  const paymentToken = putPaymentToken(
    token.id,
    event.params.oracle,
    event.params.oracleData
  )

  tobEntity.paymentTokens.push(paymentToken.id)

  tobEntity.save()
}

export function handleNewEpoch(event: NewEpochEvent): void {
  const tobEntity = putTobEntity()

  tobEntity.currentEpoch = putEpochEntity(
    event.params.epoch,
    event.params.extractedTap,
    event.params.epochTapValuation
  ).id

  tobEntity.save()

  const tapiocaOptionLiquidityProvision =
    putTapiocaOptionLiquidityProvisionEntity()

  for (
    let i = 0;
    i < tapiocaOptionLiquidityProvision.singularityPools.length;
    i++
  ) {
    const singularityPoolsId =
      tapiocaOptionLiquidityProvision.singularityPools[i]

    const singularityPool = getTolpSingularityPool(
      BigInt.fromString(singularityPoolsId)
    )

    // Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
    // uint256 quotaPerSingularity = muldiv(currentPoolWeight, _epochTAP, totalWeights);
    singularityPool.currentEpochTapAmount = singularityPool.poolWeight
      .times(event.params.extractedTap)
      .div(tapiocaOptionLiquidityProvision.totalSingularityPoolWeights)

    singularityPool.save()
  }
}

export function handleParticipate(event: ParticipateEvent): void {
  const tobEntity = putTobEntity()
  const otapEntity = putOTAPEntity(event.params.otapTokenId)
  const tolpEntity = putTOLPEntity(event.params.tolpTokenId)

  const otapParticipateEntity = new OTAPParticipatePosition(otapEntity.id)
  otapParticipateEntity.participatedAtEpoch = tobEntity.currentEpoch
  otapParticipateEntity.discount = event.params.discount.toI32()
  otapParticipateEntity.otap = otapEntity.id
  otapParticipateEntity.tolp = tolpEntity.id
  otapParticipateEntity.save()

  otapEntity.participatePosition = otapParticipateEntity.id
  otapEntity.save()
}

export function handleExitPosition(event: ExitPositionEvent): void {
  const otapEntity = putOTAPEntity(event.params.otapTokenId)

  otapEntity.participatePosition = null

  otapEntity.save()

  store.remove("OTAPParticipatePosition", otapEntity.id.toHexString())
}

export function handleExerciseOption(event: ExerciseOptionEvent): void {
  const tobEntity = putTobEntity()
  const otapEntity = putOTAPEntity(event.params.otapTokenId)

  const otapParticipateEntity = OTAPParticipatePosition.load(otapEntity.id)

  if (otapParticipateEntity == null) {
    throw new Error("OTAPParticipatePosition not found")
  }

  if (
    otapParticipateEntity.lastExercisedEpoch == null ||
    otapParticipateEntity.lastExercisedEpoch != tobEntity.currentEpoch
  ) {
    otapParticipateEntity.lastExercisedEpoch = tobEntity.currentEpoch
    otapParticipateEntity.exercisedTap = event.params.tapAmount
  } else {
    otapParticipateEntity.exercisedTap = event.params.tapAmount.plus(
      otapParticipateEntity.exercisedTap as BigInt
    )
  }

  otapParticipateEntity.save()
}
