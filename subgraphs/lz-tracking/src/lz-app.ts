import { log } from "@graphprotocol/graph-ts"

import { Receive } from "../generated/schema"
import {
  MessageFailed as MessageFailedEvent,
  RetryMessageSuccess as RetryMessageSuccessEvent,
} from "../generated/templates/LzApp/LzApp"
import { RUNNING_FROM_EDGE_OF_CHAIN } from "./constants/networks/constants"
import { LzNetworkInfo } from "./constants/networks/lzNetworkInfo"
import { lzId } from "./utils/lzId"

// https://github.com/LayerZero-Labs/solidity-examples/blob/34cf25c06f5cf26fdbef80e0d693c77552aaa2db/contracts/lzApp/NonblockingLzApp.sol
export function handleMessageFailed(event: MessageFailedEvent): void {
  const id = lzId(
    event.params._srcChainId,
    event.params._srcAddress.toHexString().substring(0, 42),
    LzNetworkInfo.currentChain().lzChainId as i32,
    event.address.toHexString(),
    event.params._nonce,
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

  entity.has_message_failed = true
  entity.payload = event.params._payload.toHexString()
  entity.message_failed_reason = event.params._reason.toString()

  entity.save()
}

export function handleRetryMessageSuccess(
  event: RetryMessageSuccessEvent,
): void {
  const id = lzId(
    event.params._srcChainId,
    event.params._srcAddress.toHexString().substring(0, 42),
    LzNetworkInfo.currentChain().lzChainId as i32,
    event.address.toHexString(),
    event.params._nonce,
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

  entity.message_failed_retry_success_tx_hash =
    event.transaction.hash.toHexString()

  entity.save()
}
