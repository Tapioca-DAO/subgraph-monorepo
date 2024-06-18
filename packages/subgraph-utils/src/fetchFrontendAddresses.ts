import { browseGlobalDb } from "./utils/browseGlobalDb"

export const fetchFrontendAddresses = (
  supportedChains: number[],
  tag: string,
) => {
  const yieldbox = browseGlobalDb(
    tag,
    "tapioca-periph",
    {
      pick: "YieldBox",
    },
    supportedChains,
  )

  const magnetar = browseGlobalDb(
    tag,
    "tapioca-periph",
    {
      pick: "MAGNETAR",
    },
    supportedChains,
  )

  const magnetarHelper = browseGlobalDb(
    tag,
    "tapioca-periph",
    {
      pick: "MAGNETAR_HELPER",
    },
    supportedChains,
  )

  const pearlmit = browseGlobalDb(
    tag,
    "tapioca-periph",
    {
      pick: "PEARLMIT",
    },
    supportedChains,
  )

  const marketHelper = browseGlobalDb(
    tag,
    "tapioca-bar",
    {
      pick: "MARKET_HELPER",
    },
    supportedChains,
  )

  const usdoHelper = browseGlobalDb(
    tag,
    "tapioca-bar",
    {
      pick: "USDO_HELPER",
    },
    supportedChains,
  )

  // tap
  const tolp = browseGlobalDb(
    tag,
    "tap-token",
    {
      pick: "TAPIOCA_OPTION_LIQUIDITY_PROVISION",
    },
    supportedChains,
  )

  const tob = browseGlobalDb(
    tag,
    "tap-token",
    {
      pick: "TAPIOCA_OPTION_BROKER",
    },
    supportedChains,
  )

  const otap = browseGlobalDb(
    tag,
    "tap-token",
    {
      pick: "OTAP",
    },
    supportedChains,
  )

  const tapToken = browseGlobalDb(
    tag,
    "tap-token",
    {
      pick: "TAP_TOKEN",
    },
    supportedChains,
  )

  const twTap = browseGlobalDb(
    tag,
    "tap-token",
    {
      pick: "TWTAP",
    },
    supportedChains,
  )

  const result: any = {}

  for (let i = 0; i < supportedChains.length; i++) {
    const main = {
      YieldBox: yieldbox[i].addresses[0],
      Magnetar: magnetar[i].addresses[0],
      MagnetarHelper: magnetarHelper[i].addresses[0],
      MarketHelper: marketHelper[i].addresses[0],
      UsdoHelper: usdoHelper[i].addresses[0],
      Pearlmit: pearlmit[i].addresses[0],
    }

    if (i === 0) {
      result[supportedChains[i]] = {
        ...main,
        TOLP: tolp[i].addresses[0],
        TOB: tob[i].addresses[0],
        OTAP: otap[i].addresses[0],
        TapToken: tapToken[i].addresses[0],
        TwTap: twTap[i].addresses[0],
      }
    } else {
      result[supportedChains[i]] = main
    }
  }

  return result
}
