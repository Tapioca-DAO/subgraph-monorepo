import { Address, BigInt, Bytes, store } from "@graphprotocol/graph-ts"

import {
  SetPaymentToken as SetPaymentTokenEvent,
  NewEpoch as NewEpochEvent,
  TOB,
  Participate as ParticipateEvent,
  ExitPosition as ExitPositionEvent,
} from "../generated/TOB/TOB"
import {
  TapiocaOptionBrokerPaymentToken,
  TapiocaOptionBroker,
  TapiocaOptionBrokerEpoch,
  OTAPParticipatePosition,
} from "../generated/schema"
import { putOTAPEntity } from "./otap"
import { putTOLPEntity } from "./tolp"
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

function putTobEntity(address: Address): TapiocaOptionBroker {
  let tobEntity = TapiocaOptionBroker.load(address)

  if (tobEntity == null) {
    tobEntity = new TapiocaOptionBroker(address)
    const tobContract = TOB.bind(address)

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
  const tobEntity = putTobEntity(event.address)

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
  const tobEntity = putTobEntity(event.address)

  tobEntity.currentEpoch = putEpochEntity(
    event.params.epoch,
    event.params.extractedTAP,
    event.params.epochTAPValuation
  ).id

  tobEntity.save()
}

export function handleParticipate(event: ParticipateEvent): void {
  const tobEntity = putTobEntity(event.address)
  const otapEntity = putOTAPEntity(event.params.tokenId)
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
