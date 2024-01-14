import { Bytes, log } from "@graphprotocol/graph-ts"

import { SetTrustedRemote as SetTrustedRemoteEvent } from "../generated/USDO/USDO"
import { RemoteTOFTMeta } from "../generated/schema"
import { StaticChainIdDefinition } from "./utils/layerzero/staticLZEVMChainId"
import { putToft } from "./utils/token/token"

export function handleSetTrustedRemoteUSDO(event: SetTrustedRemoteEvent): void {
  const remoteAddress = event.params._path.toHexString().substring(0, 42)

  const toftEntity = putToft(event.address, true)

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

  remoteToftMetaEntity.chainId = staticTokenDefinition.chainId as u32
  remoteToftMetaEntity.lzChainId = event.params._remoteChainId
  remoteToftMetaEntity.address = remoteAddress
  remoteToftMetaEntity.save()

  const remoteToftMetaArray = toftEntity.remoteTOFTs
  remoteToftMetaArray.push(remoteToftMetaEntity.id)
  toftEntity.remoteTOFTs = remoteToftMetaArray
  toftEntity.save()
}
