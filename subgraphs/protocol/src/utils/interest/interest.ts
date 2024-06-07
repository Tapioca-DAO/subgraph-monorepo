import { BigDecimal, BigInt } from "@graphprotocol/graph-ts"

import { InterestRate } from "../../../generated/schema"
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "../../common/constants"

export namespace InterestRateType {
  export const STABLE = "STABLE"
  export const VARIABLE = "VARIABLE"
  export const FIXED_TERM = "FIXED"
}

export namespace InterestRateSide {
  export const LENDER = "LENDER"
  export const BORROW = "BORROWER"
  export const COLLATERAL_PROVIDER = "COLLATERAL_PROVIDER"
}

class InterestManagerImpl {
  constructor() {}

  id(
    marketAddress: string,
    interestRateSide: string,
    interestRateType: string,
  ): string {
    // { Interest rate side }-{ Interest rate type }-{ Market ID }
    return interestRateSide
      .concat("-")
      .concat(interestRateType)
      .concat("-")
      .concat(marketAddress)
  }

  getOrCreateInterestRate(
    marketAddress: string,
    interestRateSide: string,
    interestRateType: string,
    rawRate: BigInt | null = null,
    rate: BigDecimal = BIGDECIMAL_ZERO,
  ): InterestRate {
    let interestRate = InterestRate.load(
      this.id(marketAddress, interestRateSide, interestRateType),
    )

    if (interestRate === null) {
      interestRate = new InterestRate(
        this.id(marketAddress, interestRateSide, interestRateType),
      )
    }

    if (rawRate !== null) {
      interestRate._rawRate = rawRate
      interestRate.rate = BigDecimal.fromString(rawRate.toString()).div(
        BigDecimal.fromString("10000000000000000"),
      )
    } else {
      interestRate._rawRate = BIGINT_ZERO
      interestRate.rate = rate
    }

    interestRate.side = interestRateSide
    interestRate.type = interestRateType

    interestRate.save()
    return interestRate as InterestRate
  }

  getInterestRate(id: string): InterestRate {
    return InterestRate.load(id) as InterestRate
  }

  updateInterestRate(
    id: string,
    rawRate: BigInt,
    rate: BigDecimal | null = null,
  ): void {
    const interestRate = this.getInterestRate(id)
    interestRate._rawRate = rawRate
    if (rate === null) {
      interestRate.rate = BigDecimal.fromString(rawRate.toString()).div(
        BigDecimal.fromString("10000000000000000"),
      )
    } else {
      interestRate.rate = rate
    }

    interestRate.save()
  }
}

export const InterestRateManager = new InterestManagerImpl()
