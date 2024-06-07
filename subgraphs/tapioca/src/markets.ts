import { Address, dataSource, ethereum, log } from "@graphprotocol/graph-ts"

import { Market } from "../generated/schema"
import { Markets, TOFT } from "../generated/templates"
import {
  OwnershipTransferred as OwnershipTransferredEvent,
  Singularity,
} from "../generated/templates/Markets/Singularity"
import { ContractAddressesConstants } from "./_CONSTANTS"
import { ZERO_ADDRESS_STRING } from "./utils/helper"
import { getNetworkId } from "./utils/networks/definition"
import { putToft, putToken } from "./utils/token/token"

namespace MarketType {
  export const BIG_BANG = "BIG_BANG"
  export const SINGULARITY = "SINGULARITY"
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = Market.load(event.address)
  if (entity != null) {
    return
  }
  entity = new Market(event.address)

  if (ContractAddressesConstants.isMarketBigBang(event.address.toHexString())) {
    entity.marketType = MarketType.BIG_BANG
  } else {
    putToken(event.address)
    entity.marketType = MarketType.SINGULARITY
  }

  entity.address = event.address.toHexString()

  const singularityContract = Singularity.bind(event.address)
  if (singularityContract._asset().toHexString() == ZERO_ADDRESS_STRING) {
    // contract was not initialized yet
    return
  }
  entity.chainId = getNetworkId(dataSource.network()) as i32
  entity.borrowToken = putToken(singularityContract._asset()).id
  entity.collateralToken = putToken(singularityContract._collateral()).id
  entity.oracleAddress = singularityContract._oracle().toHexString()

  entity.save()

  const borrowTokenToftEntity = putToft(Address.fromBytes(entity.borrowToken))

  if (borrowTokenToftEntity != null) {
    let borrowTokenToftEntityMarkets = borrowTokenToftEntity.markets

    if (borrowTokenToftEntityMarkets == null) {
      borrowTokenToftEntityMarkets = []
    }
    borrowTokenToftEntityMarkets.push(entity.id)
    borrowTokenToftEntity.markets = borrowTokenToftEntityMarkets

    borrowTokenToftEntity.save()
  }

  const collateralTokenToftEntity = putToft(
    Address.fromBytes(entity.collateralToken),
  )

  if (collateralTokenToftEntity != null) {
    let collateralTokenToftEntityMarkets = collateralTokenToftEntity.markets

    if (collateralTokenToftEntityMarkets == null) {
      collateralTokenToftEntityMarkets = []
    }
    collateralTokenToftEntityMarkets.push(entity.id)
    collateralTokenToftEntity.markets = collateralTokenToftEntityMarkets

    collateralTokenToftEntity.save()
  }
}

export function mapToftAndMarketAddresses(block: ethereum.Block): void {
  const toftAddresses =
    ContractAddressesConstants.getToftListForCurrentNetwork()
  for (let i = 0; i < toftAddresses.length; i++) {
    const address = toftAddresses[i]
    log.info("Mapping TOFT address: {}", [address])
    TOFT.create(Address.fromBytes(Address.fromHexString(address)))
  }

  const sglAddresses =
    ContractAddressesConstants.getMarketListForCurrentNetwork(true)
  for (let i = 0; i < sglAddresses.length; i++) {
    const address = sglAddresses[i]
    log.info("Mapping SGL address: {}", [address])
    Markets.create(Address.fromBytes(Address.fromHexString(address)))
  }

  const bbAddresses =
    ContractAddressesConstants.getMarketListForCurrentNetwork(false)
  for (let i = 0; i < bbAddresses.length; i++) {
    const address = bbAddresses[i]
    log.info("Mapping BB address: {}", [address])
    Markets.create(Address.fromBytes(Address.fromHexString(address)))
  }
}
