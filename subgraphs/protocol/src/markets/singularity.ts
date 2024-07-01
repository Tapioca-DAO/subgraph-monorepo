import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"

import { Singularity } from "../../generated/Penrose/Singularity"
import {
  Borrow,
  Deposit,
  Market,
  MarketState,
  Rebase,
  Repay,
  Token,
  TokenUsdValue,
  Withdrawal,
} from "../../generated/schema"
import {
  LogAddAsset as AddAssetEvent,
  LogAddCollateral as AddCollateralEvent,
  LogBorrow as BorrowEvent,
  LogAccrue as LogAccrueEvent,
  LogExchangeRate as LogExchangeRateEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  LogRemoveAsset as RemoveAssetEvent,
  LogRemoveCollateral as RemoveCollateralEvent,
  LogRepay as RepayEvent,
} from "../../generated/templates/Singularity/Singularity"
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  EventType,
  MarketType,
  PositionType,
  ZERO_ADDRESS,
} from "../common/constants"
import { bigIntToBigDecimal } from "../common/utils"
import { updatePositions } from "../positions"
import { getEventId } from "../utils"
import { getOrCreateAccount } from "../utils/account/account"
import { MarketAccrueInfoManager } from "../utils/interest/accrueInfo"
import { getInterestPerYear, takeFee } from "../utils/interest/apr"
import { STARTING_INTEREST_PER_YEAR } from "../utils/interest/constants"
import {
  InterestRateManager,
  InterestRateSide,
  InterestRateType,
} from "../utils/interest/interest"
import { PAC, getAmountFromRawAmount } from "../utils/protocol/amount"
import { getTapiocaProtocol } from "../utils/protocol/protocol"
import {
  MarketRebaseType,
  RebaseFetcher,
  RebaseManager,
  RebaseUtils,
} from "../utils/rebase/rebase"
import { updateAllTokenPrices, updateTokenPrice } from "../utils/token/price"
import { putToken } from "../utils/token/token"

function putSglMarket(
  address: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
): void {
  let marketEntity = Market.load(address.toHexString())
  if (marketEntity != null) {
    return
  } else {
    marketEntity = new Market(address.toHexString())
  }

  marketEntity.address = address
  marketEntity.type = MarketType.SINGULARITY

  const singularityContract = Singularity.bind(address)

  const collateralAddress = singularityContract._collateral()
  const borrowAddress = singularityContract._asset()
  log.error("handleRegisterSingularity addresses {}", [
    collateralAddress.toHexString(),
    borrowAddress.toHexString(),
  ])
  if (
    collateralAddress.toHexString() == ZERO_ADDRESS.toHexString() ||
    borrowAddress.toHexString() == ZERO_ADDRESS.toHexString()
  ) {
    return
  }
  const borrowToken = putToken(borrowAddress)
  const collateralToken = putToken(collateralAddress)

  if (borrowToken == null || collateralToken == null) {
    log.error(
      "Market: TOFTs not found for borrowToken {} or collateralToken {}",
      [
        singularityContract._asset().toHexString(),
        singularityContract._collateral().toHexString(),
      ],
    )
    return
  }

  const protocol = getTapiocaProtocol()

  marketEntity.borrowToken = borrowToken.id
  marketEntity.collateralToken = collateralToken.id
  marketEntity.oracleAddress = singularityContract._oracle()
  marketEntity._borrowTokenYieldBoxId = singularityContract._assetId()
  marketEntity._collateralTokenYieldBoxId = singularityContract._collateralId()
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
    address.toHexString(),
    InterestRateSide.LENDER,
    InterestRateType.STABLE,
    STARTING_INTEREST_PER_YEAR,
  ).id
  marketEntity.borrowInterest = InterestRateManager.getOrCreateInterestRate(
    address.toHexString(),
    InterestRateSide.BORROW,
    InterestRateType.STABLE,
  ).id
  marketEntity.collateralInterest = InterestRateManager.getOrCreateInterestRate(
    address.toHexString(),
    InterestRateSide.COLLATERAL_PROVIDER,
    InterestRateType.STABLE,
  ).id
  marketEntity.utilization = BigInt.fromU32(0)

  marketEntity.accrueInfo = MarketAccrueInfoManager.createMarketAccrueInfo(
    address.toHexString(),
  ).id

  marketEntity._totalCollateralShare = BIGINT_ZERO
  marketEntity._totalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(address.toHexString(), MarketRebaseType.SUPPLY),
    borrowToken.id,
    blockNumber,
    timestamp,
  ).id
  marketEntity._totalBorrow = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(address.toHexString(), MarketRebaseType.BORROW),
    borrowToken.id,
    blockNumber,
    timestamp,
  ).id

  marketEntity._ybTotalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(marketEntity._borrowTokenYieldBoxId),
    borrowToken.id,
    blockNumber,
    timestamp,
  ).id

  marketEntity._ybTotalCollateralAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(marketEntity._collateralTokenYieldBoxId),
    collateralToken.id,
    blockNumber,
    timestamp,
  ).id

  marketEntity.save()

  const mktIds = protocol.marketIds
  mktIds.push(marketEntity.id)
  protocol.marketIds = mktIds
  protocol.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
}

export function handleBorrow(event: BorrowEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  const singularityMarket = Market.load(event.address.toHexString())
  if (singularityMarket == null) {
    return
  }

  // update market prices
  // initial values not handled by LogExchangeRateEvent
  updateAllTokenPrices(event.block.number, event.block.timestamp)
  const market = updateMarketTotals(event.address.toHexString(), event)

  const borrowEntity = new Borrow(getEventId(event))

  const fromAccount = getOrCreateAccount(event.params.from.toHexString())
  const toAccount = getOrCreateAccount(event.params.to.toHexString())

  const amount = PAC.getTemporary(
    singularityMarket.borrowToken,
    event.params.amount,
  )

  const amountFee = PAC.getTemporary(
    singularityMarket.borrowToken,
    event.params.feeAmount,
  )

  const amountAccrued = PAC.getTemporary(
    singularityMarket.borrowToken,
    getAmountFromRawAmount(
      event.params.part,
      PositionType.BORROW,
      Address.fromBytes(singularityMarket.address),
    ),
    event.params.part,
  )

  borrowEntity.fromAccount = fromAccount.id
  borrowEntity.toAccount = toAccount.id
  borrowEntity.account = fromAccount.id
  borrowEntity.market = event.address.toHexString()
  borrowEntity.amount = amount.saveImmutable(event.block.number).id
  borrowEntity.amountAccrued = amountAccrued.saveImmutable(
    event.block.number,
  ).id
  borrowEntity.amountProtocolFees = amountFee.saveImmutable(
    event.block.number,
  ).id
  borrowEntity.token = singularityMarket.borrowToken

  // Add transaction data
  borrowEntity.hash = event.transaction.hash
  borrowEntity.nonce = event.transaction.nonce
  borrowEntity.logIndex = event.transactionLogIndex.toI32()
  borrowEntity.blockNumber = event.block.number
  borrowEntity.timestamp = event.block.timestamp
  borrowEntity.callerAddress = event.transaction.from

  borrowEntity.position = updatePositions(
    PositionType.BORROW,
    singularityMarket,
    EventType.BORROW,
    fromAccount,
    event,
  )

  borrowEntity.save()
}

export function handleRepay(event: RepayEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  const singularityMarket = Market.load(event.address.toHexString())
  if (singularityMarket == null) {
    return
  }

  // update market prices
  // initial values not handled by LogExchangeRateEvent
  updateAllTokenPrices(event.block.number, event.block.timestamp)
  const market = updateMarketTotals(event.address.toHexString(), event)

  const repayEntity = new Repay(getEventId(event))

  const fromAccount = getOrCreateAccount(event.params.from.toHexString())
  const toAccount = getOrCreateAccount(event.params.to.toHexString())

  const amount = PAC.getTemporary(
    singularityMarket.borrowToken,
    event.params.amount,
  )

  const amountAccrued = PAC.getTemporary(
    singularityMarket.borrowToken,
    getAmountFromRawAmount(
      event.params.part,
      PositionType.BORROW,
      Address.fromBytes(singularityMarket.address),
    ),
    event.params.part,
  )

  repayEntity.fromAccount = fromAccount.id
  repayEntity.toAccount = toAccount.id
  repayEntity.market = event.address.toHexString()
  repayEntity.amount = amount.saveImmutable(event.block.number).id
  repayEntity.token = singularityMarket.borrowToken

  // Add transaction data
  repayEntity.hash = event.transaction.hash
  repayEntity.nonce = event.transaction.nonce
  repayEntity.logIndex = event.transactionLogIndex.toI32()
  repayEntity.blockNumber = event.block.number
  repayEntity.timestamp = event.block.timestamp
  repayEntity.callerAddress = event.transaction.from

  repayEntity.position = updatePositions(
    PositionType.BORROW,
    singularityMarket,
    EventType.REPAY,
    toAccount,
    event,
  )

  repayEntity.save()
}

export function handleAddCollateral(event: AddCollateralEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  const singularityMarket = Market.load(event.address.toHexString())
  if (singularityMarket == null) {
    return
  }

  // update market prices
  // initial values not handled by LogExchangeRateEvent
  updateAllTokenPrices(event.block.number, event.block.timestamp)
  const market = updateMarketTotals(event.address.toHexString(), event)

  const depositEntity = new Deposit(getEventId(event))

  const fromAccount = getOrCreateAccount(event.params.from.toHexString())
  const toAccount = getOrCreateAccount(event.params.to.toHexString())

  const amount = PAC.getTemporary(
    singularityMarket.collateralToken,
    getAmountFromRawAmount(
      event.params.share,
      PositionType.PROVIDE_COLLATERAL_ASSET,
      Address.fromBytes(singularityMarket.address),
    ),
    event.params.share,
  )

  depositEntity.fromAccount = fromAccount.id
  depositEntity.toAccount = toAccount.id
  depositEntity.account = toAccount.id
  depositEntity.market = event.address.toHexString()
  depositEntity.amount = amount.saveImmutable(event.block.number).id

  depositEntity.token = singularityMarket.collateralToken

  // Add transaction data
  depositEntity.hash = event.transaction.hash
  depositEntity.nonce = event.transaction.nonce
  depositEntity.logIndex = event.transactionLogIndex.toI32()
  depositEntity.blockNumber = event.block.number
  depositEntity.timestamp = event.block.timestamp
  depositEntity.callerAddress = event.transaction.from

  depositEntity.position = updatePositions(
    PositionType.PROVIDE_COLLATERAL_ASSET,
    singularityMarket,
    EventType.DEPOSIT,
    toAccount,
    event,
  )

  depositEntity.save()
}

export function handleRemoveCollateral(event: RemoveCollateralEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  const singularityMarket = Market.load(event.address.toHexString())
  if (singularityMarket == null) {
    return
  }

  // update market prices
  // initial values not handled by LogExchangeRateEvent
  updateAllTokenPrices(event.block.number, event.block.timestamp)
  const market = updateMarketTotals(event.address.toHexString(), event)

  const withdrawalEntity = new Withdrawal(getEventId(event))

  const fromAccount = getOrCreateAccount(event.params.from.toHexString())
  const toAccount = getOrCreateAccount(event.params.to.toHexString())

  const amount = PAC.getTemporary(
    singularityMarket.borrowToken,
    getAmountFromRawAmount(
      event.params.share,
      PositionType.PROVIDE_COLLATERAL_ASSET,
      Address.fromBytes(singularityMarket.address),
    ),
    event.params.share,
  )

  withdrawalEntity.fromAccount = fromAccount.id
  withdrawalEntity.toAccount = toAccount.id
  withdrawalEntity.market = event.address.toHexString()
  withdrawalEntity.amount = amount.saveImmutable(event.block.number).id

  withdrawalEntity.token = singularityMarket.collateralToken

  // Add transaction data
  withdrawalEntity.hash = event.transaction.hash
  withdrawalEntity.nonce = event.transaction.nonce
  withdrawalEntity.logIndex = event.transactionLogIndex.toI32()
  withdrawalEntity.blockNumber = event.block.number
  withdrawalEntity.timestamp = event.block.timestamp
  withdrawalEntity.callerAddress = event.transaction.from

  withdrawalEntity.position = updatePositions(
    PositionType.PROVIDE_COLLATERAL_ASSET,
    singularityMarket,
    EventType.WITHDRAW,
    toAccount,
    event,
  )

  withdrawalEntity.save()
}

export function handleAddAsset(event: AddAssetEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  const singularityMarket = Market.load(event.address.toHexString())
  if (singularityMarket == null) {
    return
  }

  // update market prices
  // initial values not handled by LogExchangeRateEvent
  updateAllTokenPrices(event.block.number, event.block.timestamp)
  const market = updateMarketTotals(event.address.toHexString(), event)

  const depositEntity = new Deposit(getEventId(event))

  const fromAccount = getOrCreateAccount(event.params.from.toHexString())
  const toAccount = getOrCreateAccount(event.params.to.toHexString())

  const amount = PAC.getTemporary(
    singularityMarket.borrowToken,
    getAmountFromRawAmount(
      event.params.share,
      PositionType.LEND_BORROW_ASSET,
      Address.fromBytes(singularityMarket.address),
    ),
    event.params.share,
  )

  depositEntity.fromAccount = fromAccount.id
  depositEntity.toAccount = toAccount.id
  depositEntity.account = toAccount.id
  depositEntity.market = event.address.toHexString()
  depositEntity.amount = amount.saveImmutable(event.block.number).id

  depositEntity.token = singularityMarket.borrowToken

  // Add transaction data
  depositEntity.hash = event.transaction.hash
  depositEntity.nonce = event.transaction.nonce
  depositEntity.logIndex = event.transactionLogIndex.toI32()
  depositEntity.blockNumber = event.block.number
  depositEntity.timestamp = event.block.timestamp
  depositEntity.callerAddress = event.transaction.from

  depositEntity.position = updatePositions(
    PositionType.LEND_BORROW_ASSET,
    singularityMarket,
    EventType.DEPOSIT,
    toAccount,
    event,
  )

  depositEntity.save()
}

export function handleRemoveAsset(event: RemoveAssetEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  const singularityMarket = Market.load(event.address.toHexString())
  if (singularityMarket == null) {
    return
  }

  // update market prices
  // initial values not handled by LogExchangeRateEvent
  updateAllTokenPrices(event.block.number, event.block.timestamp)
  const market = updateMarketTotals(event.address.toHexString(), event)

  const withdrawalEntity = new Withdrawal(getEventId(event))

  const fromAccount = getOrCreateAccount(event.params.from.toHexString())
  const toAccount = getOrCreateAccount(event.params.to.toHexString())

  const amount = PAC.getTemporary(
    singularityMarket.borrowToken,
    getAmountFromRawAmount(
      event.params.share,
      PositionType.LEND_BORROW_ASSET,
      Address.fromBytes(singularityMarket.address),
    ),
    event.params.share,
  )

  withdrawalEntity.fromAccount = fromAccount.id
  withdrawalEntity.toAccount = toAccount.id
  withdrawalEntity.market = event.address.toHexString()
  withdrawalEntity.amount = amount.saveImmutable(event.block.number).id

  withdrawalEntity.token = singularityMarket.borrowToken

  // Add transaction data
  withdrawalEntity.hash = event.transaction.hash
  withdrawalEntity.nonce = event.transaction.nonce
  withdrawalEntity.logIndex = event.transactionLogIndex.toI32()
  withdrawalEntity.blockNumber = event.block.number
  withdrawalEntity.timestamp = event.block.timestamp
  withdrawalEntity.callerAddress = event.transaction.from

  withdrawalEntity.position = updatePositions(
    PositionType.LEND_BORROW_ASSET,
    singularityMarket,
    EventType.WITHDRAW,
    toAccount,
    event,
  )

  withdrawalEntity.save()
}

export function handleAccrue(event: LogAccrueEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  log.info("[YieldBox:SGL] Log Accrue {} {} {} {}", [
    event.params.accruedAmount.toString(),
    event.params.feeFraction.toString(),
    event.params.rate.toString(),
    event.params.utilization.toString(),
  ])
  const market = updateMarketTotals(event.address.toHexString(), event)
  const totalBorrow = Rebase.load(market._totalBorrow) as Rebase

  const accrueInfo = MarketAccrueInfoManager.getMarketAccrueInfo(
    event.address.toHexString(),
  )
  accrueInfo.feesEarnedFraction = accrueInfo.feesEarnedFraction.plus(
    event.params.feeFraction,
  )
  accrueInfo.interestPerSecond = event.params.rate
  accrueInfo.lastAccrued = event.block.timestamp
  accrueInfo.save()

  const borrowAPR = getInterestPerYear(
    totalBorrow.base,
    accrueInfo.interestPerSecond,
    accrueInfo.lastAccrued,
    event.block.timestamp,
    market.utilization,
  )
  const supplyAPR = takeFee(borrowAPR.times(market.utilization)).div(
    BigInt.fromString("1000000000000000000"),
  )

  InterestRateManager.updateInterestRate(market.supplyInterest, supplyAPR)
  InterestRateManager.updateInterestRate(market.borrowInterest, borrowAPR)

  market.utilization = event.params.utilization

  market.save()
}

export function handleExchangeRate(event: LogExchangeRateEvent): void {
  putSglMarket(event.address, event.block.number, event.block.timestamp)
  // update market prices
  const market = Market.load(event.address.toHexString()) as Market
  const token = Token.load(market.collateralToken) as Token
  updateTokenPrice(
    event.params.rate,
    token,
    event.block.number,
    event.block.timestamp,
  )
  updateTokenPrice(
    event.params.rate,
    token,
    event.block.number,
    event.block.timestamp,
  )
}

function updateMarketTotals(
  marketAddress: string,
  event: ethereum.Event,
): Market {
  const market = Market.load(marketAddress) as Market
  const borrowToken = Token.load(market.borrowToken) as Token
  let borrowTokenUsdValue = BIGDECIMAL_ZERO
  const borrowUsdValueId = borrowToken.latestUsdValue
  if (borrowUsdValueId !== null) {
    const busdVal = TokenUsdValue.load(borrowUsdValueId) as TokenUsdValue
    borrowTokenUsdValue = busdVal.usdValue
  }

  const collateralToken = Token.load(market.collateralToken) as Token
  let collateralTokenUsdValue = BIGDECIMAL_ZERO
  const collateralUsdValueId = collateralToken.latestUsdValue
  if (collateralUsdValueId !== null) {
    const colUsdVal = TokenUsdValue.load(collateralUsdValueId) as TokenUsdValue
    collateralTokenUsdValue = colUsdVal.usdValue
  }

  const totalsBorrow = RebaseFetcher.sglTotalBorrow(event.address.toHexString())
  const totalBorrow = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(
      event.address.toHexString(),
      MarketRebaseType.BORROW,
    ),
    market.borrowToken,
    event.block.number,
    event.block.timestamp,
    totalsBorrow.elastic,
    totalsBorrow.base,
  )

  const totalAsset = RebaseFetcher.sglTotalAsset(event.address.toHexString())
  market._totalAsset = RebaseManager.getOrCreateRebase(
    RebaseManager.marketId(
      event.address.toHexString(),
      MarketRebaseType.SUPPLY,
    ),
    market.borrowToken,
    event.block.number,
    event.block.timestamp,
    totalAsset.elastic,
    totalAsset.base,
  ).id

  const totalYbBorrow = RebaseFetcher.ybAssetTotals(
    market._borrowTokenYieldBoxId,
  )
  const totalYbBorrowRebase = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(market._borrowTokenYieldBoxId),
    market.borrowToken,
    event.block.number,
    event.block.timestamp,
    totalYbBorrow.elastic,
    totalYbBorrow.base,
  )
  market._ybTotalAsset = totalYbBorrowRebase.id

  const totalYbCollateral = RebaseFetcher.ybAssetTotals(
    market._collateralTokenYieldBoxId,
  )
  const totalYbCollateralRebase = RebaseManager.getOrCreateRebase(
    RebaseManager.ybId(market._collateralTokenYieldBoxId),
    market.collateralToken,
    event.block.number,
    event.block.timestamp,
    totalYbCollateral.elastic,
    totalYbCollateral.base,
  )
  market._ybTotalCollateralAsset = totalYbCollateralRebase.id

  market._totalCollateralShare = Singularity.bind(
    event.address,
  )._totalCollateralShare()

  market.totalBorrowed = totalBorrow.elastic
  market.totalBorrowSupply = RebaseUtils.ybToAmount(
    totalYbBorrowRebase,
    totalAsset.elastic,
  )
  market.totalCollateral = RebaseUtils.ybToAmount(
    totalYbCollateralRebase,
    market._totalCollateralShare,
  )

  market.totalBorrowedUsd = bigIntToBigDecimal(
    market.totalBorrowed,
    borrowToken.decimals.toI32(),
  ).times(borrowTokenUsdValue)
  market.totalBorrowSupplyUsd = bigIntToBigDecimal(
    market.totalBorrowSupply,
    borrowToken.decimals.toI32(),
  ).times(borrowTokenUsdValue)
  market.totalCollateralUsd = bigIntToBigDecimal(
    market.totalCollateral,
    collateralToken.decimals.toI32(),
  ).times(collateralTokenUsdValue)

  const stateId = `${marketAddress}-${event.block.number.toString()}`
  let ms = MarketState.load(stateId)
  if (ms === null) {
    ms = new MarketState(stateId)
  }
  ms.market = market.id
  ms.blockNumber = event.block.number
  ms.timestamp = event.block.timestamp
  ms.totalBorrowed = market.totalBorrowed
  ms.totalBorrowedUsd = market.totalBorrowedUsd
  ms.totalBorrowSupply = market.totalBorrowSupply
  ms.totalBorrowSupplyUsd = market.totalBorrowSupplyUsd
  ms.totalCollateral = market.totalCollateral
  ms.totalCollateralUsd = market.totalCollateralUsd
  ms.save()

  market.save()
  return market
}
