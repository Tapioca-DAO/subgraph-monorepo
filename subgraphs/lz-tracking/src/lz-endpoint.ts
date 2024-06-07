import { log } from "@graphprotocol/graph-ts"

import {
  PayloadCleared as PayloadClearedEvent,
  PayloadStored as PayloadStoredEvent,
} from "../generated/LzEndpoint/LzEndpoint"
import { Receive } from "../generated/schema"
import { RUNNING_FROM_EDGE_OF_CHAIN } from "./constants/networks/constants"
import { LzNetworkInfo } from "./constants/networks/lzNetworkInfo"
import { watchLzApp } from "./utils/lzAppWatcher"
import { lzId } from "./utils/lzId"

export function handlePayloadCleared(event: PayloadClearedEvent): void {
  watchLzApp(event.params.dstAddress)
  const id = lzId(
    event.params.srcChainId,
    event.params.srcAddress.toHexString(),
    LzNetworkInfo.currentChain().lzChainId as i32,
    event.params.dstAddress.toHexString(),
    event.params.nonce,
  )

  const entity = Receive.load(id)

  if (entity == null) {
    if (RUNNING_FROM_EDGE_OF_CHAIN) {
      log.warning("Receive entity not found {}", [
        event.transaction.hash.toHexString(),
      ])
      return
    }
    throw new Error("Receive entity not found")
  }

  entity.payload_stored_clear_tx_hash = event.transaction.hash.toHexString()

  entity.save()
}

export function handlePayloadStored(event: PayloadStoredEvent): void {
  watchLzApp(event.params.dstAddress)
  const id = lzId(
    event.params.srcChainId,
    event.params.srcAddress.toHexString().substring(0, 42),
    LzNetworkInfo.currentChain().lzChainId as i32,
    event.params.dstAddress.toHexString(),
    event.params.nonce,
  )

  const entity = Receive.load(id)

  if (entity == null) {
    if (RUNNING_FROM_EDGE_OF_CHAIN) {
      log.warning("Receive entity not found {}", [
        event.transaction.hash.toHexString(),
      ])
      return
    }
    throw new Error("Receive entity not found")
  }

  entity.has_payload_stored = true
  entity.payload = event.params.payload.toHexString()
  entity.payload_stored_reason = event.params.reason.toString()

  entity.save()
}
