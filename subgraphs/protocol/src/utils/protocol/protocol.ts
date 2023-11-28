import { Address, dataSource, log } from "@graphprotocol/graph-ts"

import { TapiocaProtocol } from "../../../generated/schema"
import { ProtocolType, ZERO_ADDRESS } from "../../common/constants"
import { getNetwork } from "./networks"
import { Versions } from "./versions"

const TAPIOCA_PROTOCOL_ID = "tapioca-protocol"

export function getTapiocaProtocol(): TapiocaProtocol {
  return TapiocaProtocol.load(TAPIOCA_PROTOCOL_ID) as TapiocaProtocol
}

export function createTapiocaProtocol(
  penroseAddress: Address = ZERO_ADDRESS
): TapiocaProtocol {
  let protocol = TapiocaProtocol.load(TAPIOCA_PROTOCOL_ID)
  if (protocol) {
    return protocol
  }

  protocol = new TapiocaProtocol(TAPIOCA_PROTOCOL_ID)
  protocol.name = "Tapioca"
  protocol.slug = "tapioca"
  protocol.schemaVersion = Versions.getSchemaVersion()
  protocol.subgraphVersion = Versions.getSubgraphVersion()
  protocol.methodologyVersion = Versions.getMethodologyVersion()
  protocol.network = getNetwork(dataSource.network())
  protocol.type = ProtocolType.TAPIOCA
  protocol.marketIds = []

  protocol.penroseAddress = penroseAddress

  protocol.save()
  log.error("(not an error) Tapioca protocol created on network [{}]", [
    dataSource.network(),
  ])
  return protocol
}
