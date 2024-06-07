import { BigInt, log } from "@graphprotocol/graph-ts"

import { BigBang } from "../generated/Penrose/BigBang"
import {
  RegisterSingularity as RegisterSingularityEvent,
  RegisterBigBang as RegisterBigBangEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/Penrose/Penrose"
import { Singularity } from "../generated/Penrose/Singularity"
import { Market } from "../generated/schema"
import {
  Singularity as SingularityTemplate,
  BigBang as BigBangTemplate,
} from "../generated/templates"
import { BIGDECIMAL_ZERO, BIGINT_ZERO, MarketType } from "./common/constants"
import { bigIntToBigDecimal } from "./common/utils"
import { StaticMarketFilter } from "./constants/marketFilter"
import { MarketAccrueInfoManager } from "./utils/interest/accrueInfo"
import { STARTING_INTEREST_PER_YEAR } from "./utils/interest/constants"
import {
  InterestRateManager,
  InterestRateSide,
  InterestRateType,
} from "./utils/interest/interest"
import {
  createTapiocaProtocol,
  getTapiocaProtocol,
} from "./utils/protocol/protocol"
import { MarketRebaseType, RebaseManager } from "./utils/rebase/rebase"
import { getToken } from "./utils/token/token"

export function handleRegisterSingularity(
  event: RegisterSingularityEvent,
): void {
  if (!StaticMarketFilter.isPermittedSGL(event.params.location)) {
    return
  }
  const marketEntity = new Market(event.params.location.toHexString())

  marketEntity.address = event.params.location
  marketEntity.type = MarketType.SINGULARITY

  const singularityContract = Singularity.bind(event.params.location)
  const borrowToken = getToken(singularityContract.asset())
  const collateralToken = getToken(singularityContract.collateral())

  if (borrowToken == null || collateralToken == null) {
    log.error(
      "Market: TOFTs not found for borrowToken {} or collateralToken {}",
      [
        singularityContract.asset().toHexString(),
        singularityContract.collateral().toHexString(),
      ],
    )
    return
  }

  const protocol = getTapiocaProtocol()

  marketEntity.borrowToken = borrowToken.id
  marketEntity.collateralToken = collateralToken.id
  marketEntity.oracleAddress = singularityContract.oracle()
  marketEntity._borrowTokenYieldBoxId = singularityContract.assetId()
  marketEntity._collateralTokenYieldBoxId = singularityContract.collateralId()
  marketEntity.positionCount = 0
  marketEntity.lendingPositionCount = 0
  marketEntity.borrowingPositionCount = 0
  marketEntity.openPositionCount = 0
  marketEntity.closedPositionCount = 0
  marketEntity.protocol = protocol.id

  marketEntity.totalBorrowed = BIGINT_ZERO
  marketEntity.totalBorrowedUsd = BIGDECIMAL_ZERO
  marketEntity.totalBorrowSupply = BIGINT_ZERO
  marketEntity.totalBorrowSupplyUsd = BIGDECIMAL_ZERO
  marketEntity.totalCollateral = BIGINT_ZERO
  marketEntity.totalCollateralUsd = BIGDECIMAL_ZERO

  marketEntity.totalFeesEarnedFraction = BIGINT_ZERO

  marketEntity.supplyInterest = InterestRateManager.getOrCreateInterestRate(
    event.params.location.toHexString(),
    InterestRateSide.LENDER,
    InterestRateType.STABLE,
    STARTING_INTEREST_PER_YEAR,
  ).id
  marketEntity.borrowInterest = InterestRateManager.getOrCreateInterestRate(
    event.params.location.toHexString(),
    InterestRateSide.BORROW,
    InterestRateType.STABLE,
  ).id
  marketEntity.collateralInterest = InterestRateManager.getOrCreateInterestRate(
    event.params.location.toHexString(),
    InterestRateSide.COLLATERAL_PROVIDER,
    InterestRateType.STABLE,
  ).id
  marketEntity.utilization = BigInt.fromU32(0)

  marketEntity.accrueInfo = MarketAccrueInfoManager.createMarketAccrueInfo(
    event.params.location.toHexString(),
  ).id

  marketEntity._totalCollateralShare = BIGINT_ZERO
  marketEntity._totalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(
      event.params.location.toHexString(),
      MarketRebaseType.SUPPLY,
    ),
    borrowToken.id,
    event.block.number,
    event.block.timestamp,
  ).id
  marketEntity._totalBorrow = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(
      event.params.location.toHexString(),
      MarketRebaseType.BORROW,
    ),
    borrowToken.id,
    event.block.number,
    event.block.timestamp,
  ).id

  marketEntity._ybTotalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(marketEntity._borrowTokenYieldBoxId),
    borrowToken.id,
    event.block.number,
    event.block.timestamp,
  ).id

  marketEntity._ybTotalCollateralAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(marketEntity._collateralTokenYieldBoxId),
    collateralToken.id,
    event.block.number,
    event.block.timestamp,
  ).id

  marketEntity.save()

  const mktIds = protocol.marketIds
  mktIds.push(marketEntity.id)
  protocol.marketIds = mktIds
  protocol.save()

  SingularityTemplate.create(event.params.location)
}

export function handleRegisterBigBang(event: RegisterBigBangEvent): void {
  if (!StaticMarketFilter.isPermittedBB(event.params.location)) {
    return
  }
  const entity = new Market(event.params.location.toHexString())

  entity.address = event.params.location
  entity.type = MarketType.BIG_BANG

  const contract = BigBang.bind(event.params.location)
  const borrowToft = getToken(contract.asset())
  const collateralToft = getToken(contract.collateral())

  if (borrowToft == null || collateralToft == null) {
    log.error(
      "Market: TOFTs not found for borrowToken {} or collateralToken {}",
      [contract.asset().toHexString(), contract.collateral().toHexString()],
    )
    return
  }

  const protocol = getTapiocaProtocol()

  entity.borrowToken = borrowToft.id
  entity.collateralToken = collateralToft.id
  entity.oracleAddress = contract.oracle()
  entity._borrowTokenYieldBoxId = contract.assetId()
  entity._collateralTokenYieldBoxId = contract.collateralId()
  entity.positionCount = 0
  entity.lendingPositionCount = 0 // One, for the protocol? Probably not..
  entity.borrowingPositionCount = 0
  entity.openPositionCount = 0
  entity.closedPositionCount = 0
  entity.protocol = protocol.id

  // TODO: Update vs USDO? Parse/cast?
  const borrowCap = contract.totalBorrowCap()
  const annualInterest = InterestRateManager.getOrCreateInterestRate(
    event.params.location.toHexString(),
    InterestRateSide.BORROW,
    InterestRateType.STABLE,
    contract.getDebtRate(),
  ).id

  entity.totalBorrowed = BIGINT_ZERO
  entity.totalBorrowedUsd = BIGDECIMAL_ZERO
  entity.totalBorrowSupply = borrowCap
  entity.totalBorrowSupplyUsd = bigIntToBigDecimal(borrowCap)
  entity.totalCollateral = BIGINT_ZERO
  entity.totalCollateralUsd = BIGDECIMAL_ZERO
  entity.totalFeesEarnedFraction = BIGINT_ZERO

  entity.supplyInterest = annualInterest
  entity.borrowInterest = annualInterest
  entity.collateralInterest = InterestRateManager.getOrCreateInterestRate(
    event.params.location.toHexString(),
    InterestRateSide.COLLATERAL_PROVIDER,
    InterestRateType.STABLE,
  ).id
  entity.utilization = BIGINT_ZERO

  entity.accrueInfo = MarketAccrueInfoManager.createMarketAccrueInfo(
    event.params.location.toHexString(),
    MarketType.BIG_BANG,
  ).id

  entity._totalCollateralShare = BIGINT_ZERO
  entity._totalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(
      event.params.location.toHexString(),
      MarketRebaseType.SUPPLY,
    ),
    borrowToft.id,
    event.block.number,
    event.block.timestamp,
  ).id
  entity._totalBorrow = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(
      event.params.location.toHexString(),
      MarketRebaseType.BORROW,
    ),
    borrowToft.id,
    event.block.number,
    event.block.timestamp,
  ).id

  entity._ybTotalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(entity._borrowTokenYieldBoxId),
    borrowToft.id,
    event.block.number,
    event.block.timestamp,
  ).id

  entity._ybTotalCollateralAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(entity._collateralTokenYieldBoxId),
    collateralToft.id,
    event.block.number,
    event.block.timestamp,
  ).id

  entity.save()

  const mktIds = protocol.marketIds
  mktIds.push(entity.id)
  protocol.marketIds = mktIds
  protocol.save()

  BigBangTemplate.create(event.params.location)
}

export function handleDeploy(event: OwnershipTransferredEvent): void {
  // ! this will be called when contract is deployed ensuring that Tapioca Protocol is always present
  // and has penrose address
  createTapiocaProtocol(event.address)
}
