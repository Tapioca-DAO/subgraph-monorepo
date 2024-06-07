import { Address } from "@graphprotocol/graph-ts"

import { BigBang } from "../../../generated/Penrose/BigBang"
import { Singularity } from "../../../generated/Penrose/Singularity"
import { MarketAccrueInfo } from "../../../generated/schema"
import { BIGINT_ZERO, MarketType } from "../../common/constants"

class MarketAccrueInfoManagerImpl {
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

  createMarketAccrueInfo(
    marketAddress: string,
    marketType: string = MarketType.SINGULARITY,
  ): MarketAccrueInfo {
    const kashiPairAccureInfo = new MarketAccrueInfo(marketAddress)

    if (marketType == MarketType.SINGULARITY) {
      const pairContract = Singularity.bind(Address.fromString(marketAddress))
      const accrueInfo = pairContract.accrueInfo()
      kashiPairAccureInfo.interestPerSecond = accrueInfo.value0
      kashiPairAccureInfo.lastAccrued = accrueInfo.value1
      kashiPairAccureInfo.feesEarnedFraction = accrueInfo.value2
    } else if (marketType == MarketType.BIG_BANG) {
      const pairContract = BigBang.bind(Address.fromString(marketAddress))
      const accrueInfo = pairContract.accrueInfo()
      kashiPairAccureInfo.interestPerSecond = accrueInfo.value0
      kashiPairAccureInfo.lastAccrued = accrueInfo.value1
      kashiPairAccureInfo.feesEarnedFraction = BIGINT_ZERO
    }

    kashiPairAccureInfo.save()
    return kashiPairAccureInfo
  }

  getMarketAccrueInfo(id: string): MarketAccrueInfo {
    return MarketAccrueInfo.load(id) as MarketAccrueInfo
  }
}

export const MarketAccrueInfoManager = new MarketAccrueInfoManagerImpl()
