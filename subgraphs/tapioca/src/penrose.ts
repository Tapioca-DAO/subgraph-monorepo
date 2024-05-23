import { Address, dataSource, ethereum, log } from "@graphprotocol/graph-ts"

import { BigBang } from "../generated/Penrose/BigBang"
import {
  RegisterSingularity as RegisterSingularityEvent,
  RegisterBigBang as RegisterBigBangEvent,
} from "../generated/Penrose/Penrose"
import { Singularity } from "../generated/Penrose/Singularity"
import { BigBangMarket, SingularityMarket } from "../generated/schema"
import { TOFT } from "../generated/templates"
import { ContractAddressesConstants } from "./_CONSTANTS"
import { getNetworkId } from "./utils/networks/definition"
import { putToft, putToken } from "./utils/token/token"

export function handleRegisterSingularity(
  event: RegisterSingularityEvent
): void {
  const entity = new SingularityMarket(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.address = event.params.location.toHexString()

  if (!ContractAddressesConstants.isMarketWhitelisted(entity.address)) {
    log.warning("Market {} is not whitelisted", [entity.address])
    return
  }

  const singularityContract = Singularity.bind(event.params.location)
  entity.chainId = getNetworkId(dataSource.network()) as i32
  entity.borrowToken = putToken(singularityContract._asset()).id
  entity.collateralToken = putToken(singularityContract._collateral()).id
  entity.oracleAddress = singularityContract._oracle().toHexString()

  entity.save()

  putToken(event.params.location)

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
    Address.fromBytes(entity.collateralToken)
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

export function handleRegisterBigBang(event: RegisterBigBangEvent): void {
  const entity = new BigBangMarket(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.address = event.params.location.toHexString()

  if (!ContractAddressesConstants.isMarketWhitelisted(entity.address)) {
    log.warning("Market {} is not whitelisted", [entity.address])
    return
  }

  const bbContract = BigBang.bind(event.params.location)
  entity.chainId = getNetworkId(dataSource.network()) as i32
  entity.borrowToken = putToken(bbContract._asset()).id
  entity.collateralToken = putToken(bbContract._collateral()).id
  entity.oracleAddress = bbContract._oracle().toHexString()

  entity.save()

  const borrowTokenToftEntity = putToft(Address.fromBytes(entity.borrowToken))

  if (borrowTokenToftEntity != null) {
    let borrowTokenToftEntityMarkets = borrowTokenToftEntity.bigBangMarkets

    if (borrowTokenToftEntityMarkets == null) {
      borrowTokenToftEntityMarkets = []
    }
    borrowTokenToftEntityMarkets.push(entity.id)
    borrowTokenToftEntity.bigBangMarkets = borrowTokenToftEntityMarkets

    borrowTokenToftEntity.save()
  }

  const collateralTokenToftEntity = putToft(
    Address.fromBytes(entity.collateralToken)
  )

  if (collateralTokenToftEntity != null) {
    let collateralTokenToftEntityMarkets =
      collateralTokenToftEntity.bigBangMarkets

    if (collateralTokenToftEntityMarkets == null) {
      collateralTokenToftEntityMarkets = []
    }
    collateralTokenToftEntityMarkets.push(entity.id)
    collateralTokenToftEntity.bigBangMarkets = collateralTokenToftEntityMarkets

    collateralTokenToftEntity.save()
  }
}

export function mapToftAddresses(block: ethereum.Block): void {
  const addresses = ContractAddressesConstants.getToftListForCurrentNetwork()
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]
    log.info("Mapping TOFT address: {}", [address])
    TOFT.create(Address.fromBytes(Address.fromHexString(address)))
  }
}
