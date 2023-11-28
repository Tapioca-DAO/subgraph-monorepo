import { Address, BigInt } from "@graphprotocol/graph-ts"

import { Singularity } from "../../../generated/Penrose/Singularity"
import { Rebase } from "../../../generated/schema"
import { YieldBox } from "../../../generated/templates/Singularity/YieldBox"
import { BIGINT_ONE, TokenType } from "../../common/constants"
import { YieldBoxManager } from "../../yieldBox/manager"
import { BIG_INT_ONE, BIG_INT_ZERO } from "../interest/constants"

export namespace MarketRebaseType {
  export const BORROW = "BORROW"
  export const SUPPLY = "SUPPLY"
}

class RebaseManagerImpl {
  constructor() {}

  marketId(marketAddress: string, marketRebaseType: string): string {
    return marketAddress.concat("-").concat(marketRebaseType)
  }

  ybId(tokenYbId: BigInt): string {
    return tokenYbId.toString()
  }

  getOrCreateRebase(
    id: string,
    tokenAddress: string,
    blockNumber: BigInt,
    timestamp: BigInt,
    totalsElastic: BigInt | null = null,
    totalsBase: BigInt | null = null
  ): Rebase {
    let rebase = Rebase.load(id)

    if (rebase === null) {
      rebase = new Rebase(id)
    }

    rebase.token = tokenAddress
    if (totalsElastic !== null && totalsBase !== null) {
      rebase.elastic = totalsElastic
      rebase.base = totalsBase
    } else {
      rebase.elastic = BIG_INT_ZERO
      rebase.base = BIG_INT_ZERO
    }

    rebase.timestamp = timestamp
    rebase.blockNumber = blockNumber
    rebase.save()
    return rebase as Rebase
  }

  getRebase(id: string): Rebase {
    return Rebase.load(id) as Rebase
  }
}

interface Totals {
  elastic: BigInt
  base: BigInt
}

class YbAssetTotals implements Totals {
  elastic: BigInt // shares
  base: BigInt // amount
}

class SglBorrowTotals implements Totals {
  elastic: BigInt // Total token amount to be repayed by borrowers
  base: BigInt // Total parts of the debt held by borrowers
}

class SglAssetTotals implements Totals {
  elastic: BigInt // YieldBox shares held by the Singularity
  base: BigInt // Total fractions held by asset suppliers
}

class RebaseFetcherImpl {
  constructor() {}

  ybAssetTotals(ybTokenId: BigInt): YbAssetTotals {
    const contract = YieldBox.bind(
      Address.fromBytes(YieldBoxManager.getOrCreate().yieldBoxAddress)
    )
    const totals = contract.try_assetTotals(ybTokenId)

    if (!totals.reverted) {
      return {
        elastic: totals.value.getTotalShare(),
        base: totals.value.getTotalAmount(),
      }
    }

    return { elastic: BIG_INT_ONE, base: BIG_INT_ONE }
  }

  sglTotalBorrow(marketAddress: string): SglBorrowTotals {
    const contract = Singularity.bind(Address.fromString(marketAddress))
    const totals = contract.try_totalBorrow()

    if (!totals.reverted) {
      return {
        elastic: totals.value.getElastic(),
        base: totals.value.getBase(),
      }
    }

    return { elastic: BIG_INT_ONE, base: BIG_INT_ONE }
  }

  sglTotalAsset(marketAddress: string): SglAssetTotals {
    const contract = Singularity.bind(Address.fromString(marketAddress))
    const totals = contract.try_totalAsset()

    if (!totals.reverted) {
      return {
        elastic: totals.value.getElastic(),
        base: totals.value.getBase(),
      }
    }

    return { elastic: BIG_INT_ONE, base: BIG_INT_ONE }
  }
}

class RebaseUtilsImpl {
  constructor() {}
  toBase(total: Rebase, elastic: BigInt, roundUp: boolean = false): BigInt {
    if (total.elastic.equals(BigInt.fromU32(0))) {
      return elastic
    }

    const base = elastic.times(total.base).div(total.elastic)

    if (roundUp && base.times(total.elastic).div(total.base).lt(elastic)) {
      return base.plus(BigInt.fromU32(1))
    }

    return base
  }

  toElastic(total: Rebase, base: BigInt, roundUp: boolean = false): BigInt {
    if (total.base.equals(BigInt.fromU32(0))) {
      return base
    }

    const elastic = base.times(total.elastic).div(total.base)

    if (roundUp && elastic.times(total.base).div(total.elastic).lt(base)) {
      return elastic.plus(BigInt.fromU32(1))
    }

    return elastic
  }

  ybToAmount(
    total: Rebase,
    shares: BigInt,
    roundUp: boolean = false,
    tokenType: string = TokenType.ERC20
  ): BigInt {
    // TODO add actual token types
    if (tokenType === TokenType.Native || tokenType === TokenType.ERC721) {
      return shares
    }
    // elastic = shares
    // base = amount
    const totalAmount = total.base.plus(BIGINT_ONE)
    const totalShares = total.elastic.plus(BigInt.fromU32(1e8 as u32))

    const amount = shares.times(totalAmount).div(totalShares)

    if (roundUp && amount.times(totalShares).div(totalAmount).lt(shares)) {
      return amount.plus(BIGINT_ONE)
    }

    return amount
  }

  ybToShare(
    total: Rebase,
    amount: BigInt,
    roundUp: boolean = false,
    tokenType: string = TokenType.ERC20
  ): BigInt {
    // TODO add actual token types
    if (tokenType === TokenType.Native || tokenType === TokenType.ERC721) {
      return amount
    }
    // elastic = shares
    // base = amount
    const totalAmount = total.base.plus(BIGINT_ONE)
    const totalShares = total.elastic.plus(BigInt.fromU32(1e8))

    const shares = amount.times(totalShares).div(totalAmount)

    if (roundUp && shares.times(totalAmount).div(totalShares).lt(amount)) {
      return shares.plus(BIGINT_ONE)
    }

    return shares
  }
}

export const RebaseManager = new RebaseManagerImpl()
export const RebaseFetcher = new RebaseFetcherImpl()
export const RebaseUtils = new RebaseUtilsImpl()
