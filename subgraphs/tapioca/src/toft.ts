import { BigInt, Bytes, dataSource, log } from "@graphprotocol/graph-ts"

import { RemoteTOFTMeta, TOFToken } from "../generated/schema"
import {
  TOFT as TOFTContract,
  PeerSet as PeerSetEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/templates/TOFT/TOFT"
import { StaticChainIdDefinition } from "./utils/layerzero/staticLZEVMChainId"
import { getNetworkId } from "./utils/networks/definition"
import { putToft, putToken } from "./utils/token/token"

export function handlePeerSet(event: PeerSetEvent): void {
  const remoteAddress = "0x" + event.params.peer.toHexString().slice(-40)

  const toftEntity = TOFToken.load(event.address)

  if (toftEntity == null) {
    log.error("TOFToken {} not found", [event.address.toHexString()])
    return
  }

  const staticTokenDefinition = StaticChainIdDefinition.fromLzChainId(
    event.params.eid.toI32()
  )
  if (staticTokenDefinition == null) {
    log.error("Unsupported network with LZ ID {} found. Skipping.", [
      event.params.eid.toString(),
    ])
    return
  }
  const remoteToftMetaEntityId = Bytes.fromHexString(
    event.params.eid.toString() + "-" + event.address.toHexString()
  )
  let remoteToftMetaEntity = RemoteTOFTMeta.load(remoteToftMetaEntityId)
  if (remoteToftMetaEntity == null) {
    remoteToftMetaEntity = new RemoteTOFTMeta(remoteToftMetaEntityId)
  }

  remoteToftMetaEntity.chainId = staticTokenDefinition.chainId as u32
  remoteToftMetaEntity.lzChainId = event.params.eid.toI32()
  remoteToftMetaEntity.address = remoteAddress
  remoteToftMetaEntity.save()

  const remoteToftMetaArray = toftEntity.remoteTOFTs
  remoteToftMetaArray.push(remoteToftMetaEntity.id)
  toftEntity.remoteTOFTs = remoteToftMetaArray
  toftEntity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  const toftEntity = putToft(event.address)

  const currentNetworkInfo = StaticChainIdDefinition.fromChainId(
    getNetworkId(dataSource.network())
  )
  if (currentNetworkInfo == null) {
    throw new Error("Unsupported network found.")
  }
  const c_toft = TOFTContract.bind(event.address)
  const result = c_toft.try_hostEid()

  if (result.reverted) {
    // this must be USDO then
    // throw new Error("hostChainID is not available", result.value.toString())
  } else {
    if (
      !BigInt.compare(
        BigInt.fromI32(currentNetworkInfo.lzChainId as i32),
        result.value
      )
    ) {
      const erc20Result = c_toft.try_erc20()
      if (erc20Result.reverted) {
        throw new Error("erc20 is not available")
      }
      toftEntity.underlyingToken = putToken(erc20Result.value).id
    }
  }

  toftEntity.save()
}
