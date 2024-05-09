import { Address, dataSource } from "@graphprotocol/graph-ts"

import { AOTAP } from "../generated/AirdropBroker/AOTAP"
import { Participate as ParticipateEvent } from "../generated/AirdropBroker/AirdropBroker"
import { ParticipationAOTap } from "../generated/schema"
import { BASIS_POINT } from "./constants"

export function handleParticipate(event: ParticipateEvent): void {
  const aotapAddress = Address.fromBytes(
    Address.fromHexString(dataSource.context().getString("aotap_address"))
  )

  const c_aotap = AOTAP.bind(aotapAddress)

  const entity = new ParticipationAOTap(
    event.transaction.hash
      .toHexString()
      .concat("-")
      .concat(event.logIndex.toString())
  )

  const attributes = c_aotap.try_attributes(event.params.aoTAPTokenID)

  if (attributes.reverted) {
    throw new Error(
      `Failed to get attributes of aoTAPTokenID ${event.params.aoTAPTokenID.toString()}`
    )
  }

  entity.tapAmount = attributes.value.value1.amount
  entity.discount = attributes.value.value1.discount.div(BASIS_POINT).toI32()
  entity.expirationTimestamp = attributes.value.value1.expiry.toI32()
  entity.epochClaimed = event.params.epoch.toI32()
  entity.participantAddress = attributes.value.value0.toHexString()

  entity.save()
}
