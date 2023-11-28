import { Address, log } from "@graphprotocol/graph-ts"

import {
  RemoteTOFTMeta,
  TOFToken,
  TeleportReceived,
} from "../../generated/schema"
import {
  SetTrustedRemote as SetTrustedRemoteEventToft,
  ReceiveFromChain as ReceiveFromChainEventToft,
} from "../../generated/templates/TOFT/TOFT"
import { getEventId } from "../utils"
import { getOrCreateAccount } from "../utils/account/account"
import { StaticChainIdDefinition } from "../utils/layerzero/staticLZEVMChainId"
import { getToft } from "../utils/token/token"

export function handleSetTrustedRemoteTofts(
  event: SetTrustedRemoteEventToft
): void {
  const remoteAddress = event.params._path.toHexString().substring(0, 42)

  const toftEntity = getToft(event.address)

  if (toftEntity == null) {
    log.error("TOFToken {} not found", [event.address.toHexString()])
    return
  }

  const staticTokenDefinition = StaticChainIdDefinition.fromLzChainId(
    event.params._remoteChainId
  )
  if (staticTokenDefinition == null) {
    log.error("Unsupported network with LZ ID {} found. Skipping.", [
      event.params._remoteChainId.toString(),
    ])
    return
  }
  const chainId = staticTokenDefinition.chainId as u32
  const remoteToftMetaEntityId =
    chainId.toString() + "-" + event.address.toHexString()
  let remoteToftMetaEntity = RemoteTOFTMeta.load(remoteToftMetaEntityId)
  if (remoteToftMetaEntity == null) {
    remoteToftMetaEntity = new RemoteTOFTMeta(remoteToftMetaEntityId)
  }

  remoteToftMetaEntity.remoteChainId = staticTokenDefinition.chainId as u32
  remoteToftMetaEntity.remoteLZChainId = event.params._remoteChainId
  remoteToftMetaEntity.remoteTOFTokenAddress = Address.fromString(remoteAddress)
  remoteToftMetaEntity.TOFToken = toftEntity.id
  remoteToftMetaEntity.save()
}

export function handleReceiveFromChainTofts(
  event: ReceiveFromChainEventToft
): void {
  const toftEntity = TOFToken.load(event.address.toHexString())

  if (toftEntity == null) {
    log.error("TOFToken {} not found", [event.address.toHexString()])
    return
  }

  const staticChainDefinition = StaticChainIdDefinition.fromLzChainId(
    event.params._srcChainId
  )
  if (staticChainDefinition == null) {
    log.error("Unsupported network with LZ ID {} found. Skipping.", [
      event.params._srcChainId.toString(),
    ])
    return
  }

  const teleportReceivedEntity = new TeleportReceived(getEventId(event))

  teleportReceivedEntity.amount = event.params._amount
  teleportReceivedEntity.sourceChainId = staticChainDefinition.chainId as u32
  teleportReceivedEntity.sourceLZChainId = event.params._srcChainId
  teleportReceivedEntity.destinationTOFToken = toftEntity.id
  teleportReceivedEntity.destinationAccount = getOrCreateAccount(
    event.params._to.toHexString()
  ).id

  // Add transaction data
  teleportReceivedEntity.hash = event.transaction.hash
  teleportReceivedEntity.nonce = event.transaction.nonce
  teleportReceivedEntity.logIndex = event.transactionLogIndex.toI32()
  teleportReceivedEntity.blockNumber = event.block.number
  teleportReceivedEntity.timestamp = event.block.timestamp
  teleportReceivedEntity.callerAddress = event.transaction.from

  teleportReceivedEntity.save()
}
