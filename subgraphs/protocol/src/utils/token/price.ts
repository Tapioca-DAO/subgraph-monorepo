// updates all input token prices using the price oracle
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"

import { MarketOracle } from "../../../generated/Penrose/MarketOracle"
import {
  Market,
  TOFToken,
  Token,
  TokenUsdValue,
} from "../../../generated/schema"
import {
  BIGINT_ZERO,
  BIGDECIMAL_ZERO,
  BIGDECIMAL_ONE,
} from "../../common/constants"
import { bigIntToBigDecimal } from "../../common/utils"
import { getTapiocaProtocol } from "../protocol/protocol"

// this is a secondary option since not every market's price oracle "peekSpot()" will work
export function updateAllTokenPrices(
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  const protocol = getTapiocaProtocol()
  const ms = protocol.marketIds

  for (let i = 0; i < ms.length; i++) {
    const market = Market.load(ms[i])
    if (!market) {
      log.warning("[updateAllTokenPrices] Market not found: {}", [ms[i]])
      continue
    }

    const borrowToft = TOFToken.load(market.borrowToken)!

    const borrowToftToken = Token.load(market.borrowToken)!
    const collateralToftToken = Token.load(market.collateralToken)!

    if (borrowToft.isUSDO) {
      updateTokenPrice(
        BigInt.fromI32(1).times(
          BigInt.fromI32(10).pow(borrowToftToken.decimals.toI32() as u8)
        ),
        borrowToftToken,
        blockNumber,
        timestamp
      )
    }

    // check if token price is already updated for this block
    const colLatestUsdValueId = collateralToftToken.latestUsdValue
    if (colLatestUsdValueId !== null) {
      const tokenUsdValue = TokenUsdValue.load(colLatestUsdValueId)
      if (tokenUsdValue !== null) {
        if (tokenUsdValue.blockNumber.ge(blockNumber)) {
          return
        }
      }
    }

    const marketPriceOracle = MarketOracle.bind(
      Address.fromBytes(market.oracleAddress)
    )

    // get exchange rate for input token
    const exchangeRateCall = marketPriceOracle.try_peekSpot(
      Bytes.fromHexString("0x00")
    )
    if (exchangeRateCall.reverted || exchangeRateCall.value == BIGINT_ZERO) {
      log.warning(
        "[updateAllTokenPrices] Market {} priceOracle peekSpot() failed",
        [market.id]
      )
      continue
    }

    updateTokenPrice(
      exchangeRateCall.value,
      collateralToftToken,
      blockNumber,
      timestamp
    )
  }
}

// Update token price using the exchange rate
// update on the market and token
export function updateTokenPrice(
  rate: BigInt,
  token: Token,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let priceUSD = BIGDECIMAL_ZERO
  if (rate != BIGINT_ZERO) {
    priceUSD = BIGDECIMAL_ONE.div(
      bigIntToBigDecimal(rate, token.decimals.toI32())
    )
  }

  const latestUsdValueId = token.latestUsdValue
  if (latestUsdValueId !== null) {
    const tokenUsdValue = TokenUsdValue.load(latestUsdValueId)
    if (tokenUsdValue != null) {
      // * we only update if the price has actually changed
      if (tokenUsdValue.usdValue == priceUSD) {
        return
      }
    }
  }

  const tvEntity = new TokenUsdValue(token.id + "-" + blockNumber.toString())

  // update token
  tvEntity.usdValue = priceUSD
  tvEntity.blockNumber = blockNumber
  tvEntity.timestamp = timestamp
  tvEntity.token = token.id
  tvEntity.save()

  token.latestUsdValue = tvEntity.id
  token.save()
}
