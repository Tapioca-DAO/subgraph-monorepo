import { writeJsonSync } from "fs-extra"

import { browseGlobalDb } from "./browseGlobalDb"
import { listDataForChain } from "./listDataForChain"

const execute = async () => {
  console.log("Fetching Tapioca subgraph data")
  const addressesChains = browseGlobalDb(
    "tap-token-test",
    "tapioca-bar",
    "PENROSE",
  )

  const output: { [chainId: string]: any } = {}
  for (let i = 0; i < addressesChains.length; i++) {
    output[addressesChains[i].chainId.toFixed()] = await listDataForChain(
      addressesChains[i].chainId,
      addressesChains[i].addresses[0],
    )
  }

  writeJsonSync("./src/_input/out.json", output, {
    spaces: 2,
  })
  console.log("Done. Data saved to ./src/_input/out.json")
}

execute()
