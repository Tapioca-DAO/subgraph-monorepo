import { Bytes } from "@graphprotocol/graph-ts"

import {
  Packet as PacketEvent,
  PacketReceived as PacketReceivedEvent,
} from "../generated/LzULN/LzULN"
import { Send, Receive } from "../generated/schema"
import { LzNetworkInfo } from "./constants/networks/lzNetworkInfo"
import { DeflatedPacket } from "./utils/DefatedPacket"
import { watchLzApp } from "./utils/lzAppWatcher"
import { lzId } from "./utils/lzId"
import { add } from "./utils/updateCounts"

export function handlePacket(event: PacketEvent): void {
  const packet = new DeflatedPacket(event.params.payload)

  watchLzApp(packet.srcAddress)

  const entity = new Send(Bytes.fromI32(0 as i32))
  entity.srcAddress = packet.srcAddress.toHexString()
  entity.dstAddress = packet.dstAddress.toHexString()
  entity.nonce = packet.nonce
  entity.payload = packet.payload.toHexString()
  entity.srcLzChainId = packet.srcChainId
  entity.srcChainId = LzNetworkInfo.chainFromLz(
    packet.srcChainId,
    event.transaction.hash.toHexString(),
  ).chainId as i32
  entity.dstLzChainId = packet.dstChainId
  entity.dstChainId = LzNetworkInfo.chainFromLz(
    packet.dstChainId,
    event.transaction.hash.toHexString(),
  ).chainId as i32

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHexString()

  entity.id = lzId(
    entity.srcLzChainId,
    entity.srcAddress,
    entity.dstLzChainId,
    entity.dstAddress,
    entity.nonce,
  )

  entity.save()

  add("send")
}

export function handlePacketReceived(event: PacketReceivedEvent): void {
  watchLzApp(event.params.dstAddress)

  const entity = new Receive(Bytes.fromI32(0 as i32))
  entity.srcLzChainId = event.params.srcChainId
  entity.srcChainId = LzNetworkInfo.chainFromLz(
    event.params.srcChainId,
    event.transaction.hash.toHexString(),
  ).chainId as i32
  entity.srcAddress = event.params.srcAddress.toHexString()
  entity.dstAddress = event.params.dstAddress.toHexString()
  entity.dstLzChainId = LzNetworkInfo.currentChain().lzChainId as i32
  entity.dstChainId = LzNetworkInfo.chainFromLz(
    entity.dstLzChainId,
    event.transaction.hash.toHexString(),
  ).chainId as i32

  entity.nonce = event.params.nonce
  entity.payloadHash = event.params.payloadHash.toHexString()

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash.toHexString()

  entity.has_message_failed = false
  entity.has_payload_stored = false

  entity.id = lzId(
    entity.srcLzChainId,
    entity.srcAddress,
    entity.dstLzChainId,
    entity.dstAddress,
    entity.nonce,
  )

  entity.save()

  add("receive")
}
