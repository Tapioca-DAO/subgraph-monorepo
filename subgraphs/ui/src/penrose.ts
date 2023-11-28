import { Address, dataSource } from "@graphprotocol/graph-ts"

import { BigBang } from "../generated/Penrose/BigBang"
import {
  RegisterSingularity as RegisterSingularityEvent,
  RegisterBigBang as RegisterBigBangEvent,
} from "../generated/Penrose/Penrose"
import { Singularity } from "../generated/Penrose/Singularity"
import { BigBangMarket, SingularityMarket } from "../generated/schema"
import { getNetworkId } from "./utils/networks/definition"
import { putNativeToken, putToft, putToken } from "./utils/token/token"

export function handleRegisterSingularity(
  event: RegisterSingularityEvent
): void {
  putNativeToken()
  const entity = new SingularityMarket(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.address = event.params.location

  const singularityContract = Singularity.bind(event.params.location)
  entity.chainId = getNetworkId(dataSource.network()) as i32
  entity.borrowToken = putToken(singularityContract.asset()).id
  entity.collateralToken = putToken(singularityContract.collateral()).id
  entity.oracleAddress = singularityContract.oracle()

  entity.save()

  const borrowTokenToftEntity = putToft(
    Address.fromBytes(entity.borrowToken),
    false
  )

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
    false
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

  entity.address = event.params.location

  const bbContract = BigBang.bind(event.params.location)
  entity.chainId = getNetworkId(dataSource.network()) as i32
  entity.borrowToken = putToken(bbContract.asset()).id
  entity.collateralToken = putToken(bbContract.collateral()).id
  entity.oracleAddress = bbContract.oracle()

  entity.save()

  const borrowTokenToftEntity = putToft(
    Address.fromBytes(entity.borrowToken),
    false
  )

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
    Address.fromBytes(entity.collateralToken),
    false
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
