import { Address } from "@graphprotocol/graph-ts"

import { PotentialNonBlockingLzApp } from "../../generated/schema"
import { LzApp } from "../../generated/templates"
import { add } from "./updateCounts"

export function watchLzApp(lzAppAddress: Address): void {
  let entity = PotentialNonBlockingLzApp.load(lzAppAddress)
  if (entity == null) {
    LzApp.create(lzAppAddress)
    entity = new PotentialNonBlockingLzApp(lzAppAddress)
    entity.address = lzAppAddress.toHexString()
    entity.save()

    add("potentialNonBlockingLzApp")
  }
}
