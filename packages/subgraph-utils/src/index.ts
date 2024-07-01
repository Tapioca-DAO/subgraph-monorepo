import { writeJsonSync } from "fs-extra"

import { fetchFrontendAddresses } from "./fetchFrontendAddresses"
import {
  addNativeTokens,
  addTapToStore,
  crosscheckTofts,
  deduplicateTokens,
  parseTofts,
  parseTokens,
  storeFullySetupBbMarketsWithTofts,
  storeFullySetupSglMarketsWithTofts,
} from "./listDataForChain"
import { STORE, initStore } from "./store"
import { browseGlobalDb } from "./utils/browseGlobalDb"

const TAG = "lbp-prod-deployment"

const execute = async (supportedChains: number[]) => {
  console.log("Fetching Tapioca subgraph data")
  initStore(supportedChains)
  const addressesChains = browseGlobalDb(
    TAG,
    "tapioca-bar",
    {
      pick: "PENROSE",
    },
    supportedChains,
  )

  const addressesChainsSglOft = browseGlobalDb(
    TAG,
    "tapiocaz",
    {
      pattern: "T_SGL_*",
    },
    supportedChains,
  )

  const addressesChainsTapToken = browseGlobalDb(
    TAG,
    "tap-token",
    {
      pick: "TAP_TOKEN",
    },
    supportedChains,
  )

  const addressesChainsTOLP = browseGlobalDb(
    TAG,
    "tap-token",
    {
      pick: "TAPIOCA_OPTION_LIQUIDITY_PROVISION",
    },
    supportedChains,
  )

  await storeFullySetupSglMarketsWithTofts(
    addressesChains,
    addressesChainsSglOft,
    addressesChainsTOLP,
    supportedChains,
  )

  await storeFullySetupBbMarketsWithTofts(addressesChains, supportedChains)

  addTapToStore(addressesChainsTapToken, supportedChains)
  await parseTokens(supportedChains)
  await parseTofts(supportedChains)
  addNativeTokens(supportedChains)
  deduplicateTokens()

  crosscheckTofts()

  // const addressesChainsTapToken = browseGlobalDb(TAG, "tap-token", {
  //   pick: "TAP_TOKEN",
  // })

  // for (let i = 0; i < addressesChainsTapToken.length; i++) {
  //   if (!output[addressesChainsTapToken[i].chainId.toFixed()]) {
  //     output[addressesChainsTapToken[i].chainId.toFixed()] = {
  //       sglMarkets: [],
  //       bbMarkets: [],
  //       tofts: [],
  //     }
  //   }
  //   output[addressesChainsTapToken[i].chainId.toFixed()].tofts = output[
  //     addressesChainsTapToken[i].chainId.toFixed()
  //   ].tofts.concat(addressesChainsTapToken[i].addresses)
  // }

  console.log("Collected " + STORE.output.tokens.length + " tokens")
  console.log(
    "Collected " +
      STORE.output.markets.singularityMarkets.length +
      " sgl markets",
  )
  console.log(
    "Collected " + STORE.output.markets.bigBangMarkets.length + " bb markets",
  )

  const addresses = fetchFrontendAddresses(supportedChains, TAG)

  writeJsonSync("./src/_output/addresses.json", addresses, {
    spaces: 2,
  })

  writeJsonSync("./src/_output/markets.json", STORE.output.markets, {
    spaces: 2,
  })
  writeJsonSync("./src/_output/tapiocaTokenList.json", STORE.output.tokens, {
    spaces: 2,
  })
  console.log("Done. Data saved to ./src/_output/*")
}

execute([42161])
