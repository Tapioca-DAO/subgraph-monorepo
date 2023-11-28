import { Address, Bytes, log } from "@graphprotocol/graph-ts"

import { RemoteTOFTMeta, TOFToken } from "../generated/schema"
import { SetTrustedRemote as SetTrustedRemoteEvent } from "../generated/templates/TOFT/TOFT"
import { StaticChainIdDefinition } from "./utils/layerzero/staticLZEVMChainId"

export function handleSetTrustedRemote(event: SetTrustedRemoteEvent): void {
  const remoteAddress = event.params._path.toHexString().substring(0, 42)

  const toftEntity = TOFToken.load(event.address)

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
  const remoteToftMetaEntityId = Bytes.fromHexString(
    event.params._remoteChainId.toString() + "-" + event.address.toHexString()
  )
  let remoteToftMetaEntity = RemoteTOFTMeta.load(remoteToftMetaEntityId)
  if (remoteToftMetaEntity == null) {
    remoteToftMetaEntity = new RemoteTOFTMeta(remoteToftMetaEntityId)
  }

  remoteToftMetaEntity.remoteChainId = staticTokenDefinition.chainId as u32
  remoteToftMetaEntity.remoteLZChainId = event.params._remoteChainId
  remoteToftMetaEntity.remoteTOFTokenAddress =
    Address.fromHexString(remoteAddress)
  remoteToftMetaEntity.save()

  const remoteToftMetaArray = toftEntity.remoteTOFTs
  remoteToftMetaArray.push(remoteToftMetaEntity.id)
  toftEntity.remoteTOFTs = remoteToftMetaArray
  toftEntity.save()
}
