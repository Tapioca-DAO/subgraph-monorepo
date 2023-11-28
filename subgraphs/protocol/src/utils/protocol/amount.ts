import { Address, BigInt, Value, ValueKind } from "@graphprotocol/graph-ts"

import { Singularity } from "../../../generated/Penrose/Singularity"
import {
  Market,
  TapiocaProtocolAmount,
  Token,
  TokenUsdValue,
} from "../../../generated/schema"
import { YieldBox } from "../../../generated/templates/Singularity/YieldBox"
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  PositionType,
} from "../../common/constants"
import { bigIntToBigDecimal } from "../../common/utils"
import { RebaseManager, RebaseUtils } from "../rebase/rebase"

export function getAmountFromRawAmount(
  rawAmount: BigInt,
  positionType: string,
  singularityMarketAddress: Address
): BigInt {
  const singularityMarket = Market.load(singularityMarketAddress.toHexString())!
  const singularityContract = Singularity.bind(singularityMarketAddress)

  let amount = BigInt.fromI32(0)
  const tokenId =
    positionType == PositionType.PROVIDE_COLLATERAL_ASSET
      ? singularityMarket.collateralToken
      : singularityMarket.borrowToken

  if (
    positionType == PositionType.LEND_BORROW_ASSET ||
    positionType == PositionType.PROVIDE_COLLATERAL_ASSET
  ) {
    amount = YieldBox.bind(singularityContract.yieldBox()).toAmount(
      singularityMarket._collateralTokenYieldBoxId,
      rawAmount,
      false
    )
  } else {
    // * PositionType.BORROW
    const totalBorrow = RebaseManager.getRebase(singularityMarket._totalBorrow)
    amount = RebaseUtils.toElastic(totalBorrow, rawAmount)
  }

  return amount
}

export interface ProtocolAmountCreatorInterface {
  getTemporary(
    tokenId: string,
    tokenAmount: BigInt,
    rawAmount: BigInt | null
  ): TapiocaProtocolAmount
  clone(
    from: TapiocaProtocolAmount,
    to: TapiocaProtocolAmount
  ): TapiocaProtocolAmount
  getOrCreate(id: string): TapiocaProtocolAmount
}

export class TapiocaProtocolAmountTemporary extends TapiocaProtocolAmount {
  constructor() {
    super("temporary")
  }

  set tokenId(value: string) {
    this.set("tokenId", Value.fromString(value))
  }

  get tokenId(): string {
    const value = this.get("tokenId")
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.")
    } else {
      return value.toString()
    }
  }

  save(): void {
    throw new Error("TapiocaProtocolAmountTemporary cannot be saved")
  }

  idPositionBalance(positionId: string): string {
    return positionId + "-balance"
  }

  idPositionAccruedBalance(positionId: string): string {
    return positionId + "-accrued-balance"
  }

  idPositionProtocolFeeBalance(positionId: string): string {
    return positionId + "-protocol-fee-balance"
  }

  savePositionBalance(positionId: string): TapiocaProtocolAmount {
    const clone = PAC.clone(this, PAC.getOrCreate(positionId + "-balance"))
    clone.save()
    return clone
  }

  savePositionAccruedBalance(positionId: string): TapiocaProtocolAmount {
    const clone = PAC.clone(
      this,
      PAC.getOrCreate(positionId + "-accrued-balance")
    )
    clone.save()
    return clone
  }

  savePositionProtocolFeeBalance(positionId: string): TapiocaProtocolAmount {
    const clone = PAC.clone(
      this,
      PAC.getOrCreate(positionId + "-protocol-fee-balance")
    )
    clone.save()
    return clone
  }

  saveImmutable(blockNumber: BigInt): TapiocaProtocolAmount {
    let rawAmountAppendinx = ""
    if (this.raw !== null) {
      rawAmountAppendinx = "-" + this.raw!.toString()
    }
    const id =
      blockNumber.toString() + "-" + this.amount.toString() + rawAmountAppendinx
    const clone = PAC.clone(this, PAC.getOrCreate(id))
    clone.save()
    return clone
  }

  addToAmount(
    amount: BigInt,
    rawAmount: BigInt | null = null
  ): TapiocaProtocolAmountTemporary {
    this.amount = this.amount.plus(amount)
    const thisRaw = this.raw
    if (rawAmount !== null && thisRaw !== null) {
      this.raw = thisRaw.plus(rawAmount)
    }
    this.refreshUsdAmount()
    return this
  }

  subFromAmount(amount: BigInt): TapiocaProtocolAmountTemporary {
    this.amount = this.amount.minus(amount)
    this.refreshUsdAmount()
    return this
  }

  refreshUsdAmount(): TapiocaProtocolAmountTemporary {
    const token = Token.load(this.tokenId)!
    const tusdValueId = token.latestUsdValue!
    const tokenUsdValue = TokenUsdValue.load(tusdValueId)!
    const amountUSD = bigIntToBigDecimal(
      this.amount,
      token.decimals.toI32()
    ).times(tokenUsdValue.usdValue)

    this.usdAmount = amountUSD

    return this
  }
}

export class ProtocolAmountCreator implements ProtocolAmountCreatorInterface {
  clone(
    from: TapiocaProtocolAmount,
    to: TapiocaProtocolAmount
  ): TapiocaProtocolAmount {
    to.amount = from.amount
    to.usdAmount = from.usdAmount
    to.raw = from.raw
    to.currentUsdValue = from.currentUsdValue

    return to
  }

  cloneToTemporary(
    from: TapiocaProtocolAmount
  ): TapiocaProtocolAmountTemporary {
    const tpaEntity = new TapiocaProtocolAmountTemporary()

    tpaEntity.amount = from.amount
    tpaEntity.usdAmount = from.usdAmount
    tpaEntity.raw = from.raw
    tpaEntity.currentUsdValue = from.currentUsdValue

    return tpaEntity
  }

  getTemporary(
    tokenId: string,
    tokenAmount: BigInt,
    rawAmount: BigInt | null = null
  ): TapiocaProtocolAmountTemporary {
    const tpaEntity = new TapiocaProtocolAmountTemporary()

    const token = Token.load(tokenId)!
    const tusdValueId = token.latestUsdValue!
    // Next fails
    const tokenUsdValue = TokenUsdValue.load(tusdValueId)!
    const amountUSD = bigIntToBigDecimal(
      tokenAmount,
      token.decimals.toI32()
    ).times(tokenUsdValue.usdValue)

    tpaEntity.amount = tokenAmount
    tpaEntity.usdAmount = amountUSD
    tpaEntity.raw = rawAmount
    tpaEntity.currentUsdValue = tokenUsdValue.id
    tpaEntity.tokenId = tokenId

    return tpaEntity
  }

  getEmpty(tokenId: string): TapiocaProtocolAmountTemporary {
    const tpaEntity = new TapiocaProtocolAmountTemporary()

    const token = Token.load(tokenId)!
    const tusdValueId = token.latestUsdValue!
    const tokenUsdValue = TokenUsdValue.load(tusdValueId)!

    tpaEntity.amount = BIGINT_ZERO
    tpaEntity.usdAmount = BIGDECIMAL_ZERO
    tpaEntity.currentUsdValue = tokenUsdValue.id
    tpaEntity.tokenId = tokenId

    return tpaEntity
  }

  getOrCreate(id: string): TapiocaProtocolAmount {
    let tpa = TapiocaProtocolAmount.load(id)
    if (tpa == null) {
      tpa = new TapiocaProtocolAmount(id)
      tpa.amount = BIGINT_ZERO
      tpa.usdAmount = BIGDECIMAL_ZERO
    }
    return tpa
  }
}

export const PAC = new ProtocolAmountCreator()
