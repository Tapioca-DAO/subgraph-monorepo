import { writeJsonSync } from "fs-extra"

import { browseGlobalDb } from "./browseGlobalDb"
import { listDataForChain } from "./listDataForChain"

const TAG = "tap-token-test"

const execute = async () => {
  console.log("Fetching Tapioca subgraph data")
  const addressesChains = browseGlobalDb(TAG, "tapioca-bar", {
    pick: "PENROSE",
  })

  const output: {
    [chainId: string]: Awaited<ReturnType<typeof listDataForChain>>
  } = {}
  for (let i = 0; i < addressesChains.length; i++) {
    output[addressesChains[i].chainId.toFixed()] = await listDataForChain(
      addressesChains[i].chainId,
      addressesChains[i].addresses[0],
    )
  }

  const addressesChainsTapToken = browseGlobalDb(TAG, "tap-token", {
    pick: "TAP_TOKEN",
  })

  for (let i = 0; i < addressesChainsTapToken.length; i++) {
    if (!output[addressesChainsTapToken[i].chainId.toFixed()]) {
      output[addressesChainsTapToken[i].chainId.toFixed()] = {
        sglMarkets: [],
        bbMarkets: [],
        tofts: [],
      }
    }
    output[addressesChainsTapToken[i].chainId.toFixed()].tofts = output[
      addressesChainsTapToken[i].chainId.toFixed()
    ].tofts.concat(addressesChainsTapToken[i].addresses)
  }

  const addressesChainsSglOft = browseGlobalDb(TAG, "tapiocaz", {
    pattern: "T_SGL_*",
  })

  for (let i = 0; i < addressesChainsSglOft.length; i++) {
    if (!output[addressesChainsSglOft[i].chainId.toFixed()]) {
      output[addressesChainsSglOft[i].chainId.toFixed()] = {
        sglMarkets: [],
        bbMarkets: [],
        tofts: [],
      }
    }
    output[addressesChainsSglOft[i].chainId.toFixed()].tofts = output[
      addressesChainsSglOft[i].chainId.toFixed()
    ].tofts.concat(addressesChainsSglOft[i].addresses)
  }

  writeJsonSync("./src/_input/out.json", output, {
    spaces: 2,
  })
  console.log("Done. Data saved to ./src/_input/out.json")
}

execute()
