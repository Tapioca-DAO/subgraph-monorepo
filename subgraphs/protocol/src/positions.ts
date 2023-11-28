import { ethereum, BigInt, log, Address } from "@graphprotocol/graph-ts"

import { Singularity } from "../generated/Penrose/Singularity"
import {
  Account,
  Market,
  Position,
  PositionSnapshot,
  PositionCounter,
  TapiocaProtocolAmount,
} from "../generated/schema"
import { MagnetarHelper } from "../generated/templates/Singularity/MagnetarHelper"
import { BIGINT_ZERO, EventType, PositionType } from "./common/constants"
import { StaticContractDefinition } from "./constants/addresses"
import {
  PAC,
  TapiocaProtocolAmountTemporary,
  getAmountFromRawAmount,
} from "./utils/protocol/amount"
import { RebaseManager } from "./utils/rebase/rebase"

export function updatePositions(
  positionType: string,
  market: Market,
  eventType: string,
  account: Account,
  event: ethereum.Event,
  liquidation: boolean = false
): string {
  if (
    eventType == EventType.DEPOSIT ||
    eventType == EventType.WITHDRAW ||
    eventType == EventType.BORROW ||
    eventType == EventType.LIQUIDATOR ||
    eventType == EventType.LIQUIDATEE
  ) {
    log.warning("updatePositions: {}", [eventType])
  }

  if (eventType == EventType.DEPOSIT || eventType == EventType.BORROW) {
    // add position
    return addPosition(
      market,
      account,
      eventType,
      positionType,
      event,
      getAccruedAccountBalance(
        Address.fromString(market.id),
        Address.fromString(account.id),
        positionType
      )
    ).id
  } else if (eventType == EventType.REPAY || eventType == EventType.WITHDRAW) {
    // This covers liquidations as well; they emit a repay event
    const position = subtractPosition(
      market,
      account,
      getAccruedAccountBalance(
        Address.fromString(market.id),
        Address.fromString(account.id),
        positionType
      ),
      positionType,
      eventType,
      event
    )
    if (!position) {
      return ""
    }
    return position.id
  }
  return ""
}

// grab an individual accounts balances on a market
function getAccruedAccountBalance(
  marketAddress: Address,
  accountAddress: Address,
  positionType: string
): TapiocaProtocolAmountTemporary {
  const singularityMarket = Market.load(marketAddress.toHexString())!
  const singularityContract = Singularity.bind(marketAddress)

  let tryRawAmount: ethereum.CallResult<BigInt>
  if (positionType == PositionType.BORROW) {
    tryRawAmount = singularityContract.try_userBorrowPart(accountAddress)
  } else if (positionType == PositionType.PROVIDE_COLLATERAL_ASSET) {
    tryRawAmount = singularityContract.try_userCollateralShare(accountAddress)
  } else {
    // * (positionSide == PositionType.LEND_BORROW_ASSET)
    // get userAssetFraction
    tryRawAmount = singularityContract.try_balanceOf(accountAddress)
  }

  const rawAmount = tryRawAmount.reverted ? BIGINT_ZERO : tryRawAmount.value
  let amount = BigInt.fromI32(0)

  if (positionType == PositionType.LEND_BORROW_ASSET) {
    const totalAsset = RebaseManager.getRebase(singularityMarket._totalAsset)
    amount = rawAmount
      .times(
        singularityMarket.totalBorrowSupply.plus(
          singularityMarket.totalBorrowed
        )
      )
      .div(totalAsset.base)
  } else if (positionType == PositionType.PROVIDE_COLLATERAL_ASSET) {
    const try_amount = MagnetarHelper.bind(
      StaticContractDefinition.currentChain("magnetar_helper")
    ).try_getCollateralAmountForShare(marketAddress, rawAmount)
    amount = try_amount.reverted ? BIGINT_ZERO : try_amount.value
  } else if (positionType == PositionType.BORROW) {
    amount = getAmountFromRawAmount(
      rawAmount,
      PositionType.BORROW,
      Address.fromBytes(singularityMarket.address)
    )
  }

  const tokenId =
    positionType == PositionType.PROVIDE_COLLATERAL_ASSET
      ? singularityMarket.collateralToken
      : singularityMarket.borrowToken

  return PAC.getTemporary(tokenId, amount, rawAmount)
}

export function getLiquidatePosition(
  side: string,
  marketId: string,
  accountId: string
): string {
  const positionCounter = PositionCounter.load(
    accountId.concat("-").concat(marketId).concat("-").concat(side)
  )
  if (!positionCounter) {
    log.warning("No liquidation position found for account {} on market {}", [
      accountId,
      marketId,
    ])
    return ""
  }

  const position = Position.load(
    positionCounter.id.concat("-").concat(positionCounter.nextCount.toString())
  )
  if (!position) {
    log.warning("No liquidation position found for account {} on market {}", [
      accountId,
      marketId,
    ])
    return ""
  }

  return position.id
}

// A series of side effects on position added
// They include:
// * Create a new position when needed or reuse the existing position
// * Update position related data in protocol, market, account
// * Take position snapshot
function addPosition(
  market: Market,
  account: Account,
  eventType: string,
  positionType: string,
  event: ethereum.Event,
  temporaryBalance: TapiocaProtocolAmountTemporary
): Position {
  const counterID = account.id
    .concat("-")
    .concat(market.id)
    .concat("-")
    .concat(positionType)
  let positionCounter = PositionCounter.load(counterID)
  if (!positionCounter) {
    positionCounter = new PositionCounter(counterID)
    positionCounter.nextCount = 0
    positionCounter.save()
  }
  const positionID = positionCounter.id
    .concat("-")
    .concat(positionCounter.nextCount.toString())

  let position = Position.load(positionID)
  const balance = temporaryBalance.savePositionBalance(positionID)

  const openPosition = position == null
  if (!openPosition) {
    position = position!
    position.balance = balance.id

    if (eventType == EventType.DEPOSIT) {
      position.depositCount += 1
      account.depositCount += 1
    } else if (eventType == EventType.BORROW) {
      position.borrowCount += 1
      account.borrowCount += 1
    }
    account.save()
    position.save()

    snapshotPosition(position, event, balance)
    return position
  }

  // open a new position
  position = new Position(positionID)
  position.account = account.id
  position.market = market.id
  position.hashOpened = event.transaction.hash.toHexString()
  position.blockNumberOpened = event.block.number
  position.timestampOpened = event.block.timestamp
  position.type = positionType
  position.balance = balance.id
  position.depositCount = 0
  position.withdrawCount = 0
  position.borrowCount = 0
  position.repayCount = 0

  if (eventType == EventType.DEPOSIT) {
    position.depositCount += 1
    account.depositCount += 1
  } else if (eventType == EventType.BORROW) {
    position.borrowCount += 1
    account.borrowCount += 1
  }
  position.save()

  // update account position
  account.positionCount += 1
  account.openPositionCount += 1
  account.save()

  // update market position
  market.positionCount += 1
  market.openPositionCount += 1

  if (eventType == EventType.DEPOSIT) {
    market.lendingPositionCount += 1
  } else if (eventType == EventType.BORROW) {
    market.borrowingPositionCount += 1
  }
  market.save()

  // take position snapshot
  snapshotPosition(position, event, balance)

  return position
}

// A series of side effects on position subtracted
// They include:
// * Close a position when needed or reuse the exisitng position
// * Update position related data in protocol, market, account
// * Take position snapshot
function subtractPosition(
  market: Market,
  account: Account,
  newBalance: TapiocaProtocolAmountTemporary,
  side: string,
  eventType: string,
  event: ethereum.Event
): Position | null {
  const counterID = account.id
    .concat("-")
    .concat(market.id)
    .concat("-")
    .concat(side)
  const positionCounter = PositionCounter.load(counterID)
  if (!positionCounter) {
    log.warning("[subtractPosition] position counter {} not found", [counterID])
    return null
  }
  const positionID = positionCounter.id
    .concat("-")
    .concat(positionCounter.nextCount.toString())
  const position = Position.load(positionID)
  if (!position) {
    // TODO: Can this happen?
    log.warning("[subtractPosition] position {} not found", [positionID])
    return null
  }
  position.balance = newBalance.id
  if (eventType == EventType.WITHDRAW) {
    position.withdrawCount += 1
    account.withdrawCount += 1
  } else if (eventType == EventType.REPAY) {
    position.repayCount += 1
    account.repayCount += 1
  }
  account.save()

  const closePosition = newBalance.amount == BIGINT_ZERO
  if (closePosition) {
    // update position counter
    positionCounter.nextCount += 1
    positionCounter.save()

    // close position
    position.hashClosed = event.transaction.hash.toHexString()
    position.blockNumberClosed = event.block.number
    position.timestampClosed = event.block.timestamp

    // update account position
    account.openPositionCount -= 1
    account.closedPositionCount += 1
    account.save()

    // update market position
    market.openPositionCount -= 1
    market.closedPositionCount += 1
    market.save()
  }

  const balance = newBalance.savePositionBalance(positionID)
  position.balance = balance.id
  position.save()

  // update position snapshot
  snapshotPosition(position, event, balance)

  return position
}

function snapshotPosition(
  position: Position,
  event: ethereum.Event,
  balance: TapiocaProtocolAmount
): void {
  const snapshot = new PositionSnapshot(
    position.id
      .concat("-")
      .concat(event.transaction.hash.toHexString())
      .concat("-")
      .concat(event.logIndex.toString())
  )
  snapshot.hash = event.transaction.hash
  snapshot.logIndex = event.logIndex.toI32()
  snapshot.nonce = event.transaction.nonce
  snapshot.position = position.id
  snapshot.balance = PAC.cloneToTemporary(balance).saveImmutable(
    event.block.timestamp
  ).id
  snapshot.blockNumber = event.block.number
  snapshot.timestamp = event.block.timestamp
  snapshot.save()
}
