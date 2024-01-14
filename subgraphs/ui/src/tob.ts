import { Address, Bytes } from "@graphprotocol/graph-ts"

import {
  SetPaymentToken as SetPaymentTokenEvent,
  TOB,
} from "../generated/TOB/TOB"
import { PaymentToken, TapiocaOptionBroker } from "../generated/schema"
import { putToken } from "./utils/token/token"

function putTobEntity(address: Address): TapiocaOptionBroker {
  let tobEntity = TapiocaOptionBroker.load(address)

  if (tobEntity == null) {
    tobEntity = new TapiocaOptionBroker(address)
    const tobContract = TOB.bind(address)

    tobEntity.paymentTokens = []
    tobEntity.epochDuration = tobContract.EPOCH_DURATION().toI32()
    tobEntity.save()
  }

  return tobEntity
}

function putPaymentToken(
  tokenId: Bytes,
  oracleAddress: Address,
  oracleData: Bytes
): PaymentToken {
  let paymentTokenEntity = PaymentToken.load(tokenId)

  if (paymentTokenEntity == null) {
    paymentTokenEntity = new PaymentToken(tokenId)
  }

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
