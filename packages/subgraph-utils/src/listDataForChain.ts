import { getProvider } from "./getProvider"
import {
  Penrose__factory,
  Singularity__factory,
  TOFT__factory,
} from "./typechain"

const getToftsFromMarkets = async (
  marketAddresses: string[],
  chainId: number,
) => {
  let tofts: string[] = []
  for (let i = 0; i < marketAddresses.length; i++) {
    const marketAddress = marketAddresses[i]
    const marketContract = Singularity__factory.connect(
      marketAddress,
      getProvider(chainId),
    )

    const collateralAddress = await marketContract._collateral()
    tofts = tofts.concat([
      await marketContract._asset(),
      await marketContract._collateral(),
      await TOFT__factory.connect(
        collateralAddress,
        getProvider(chainId),
      ).erc20(),
    ])
  }

  return [...new Set(tofts)]
}

export const listDataForChain = async (
  chainId: number,
  penroseAddress: string,
) => {
  const penroseContract = Penrose__factory.connect(
    penroseAddress,
    getProvider(chainId),
  )

  const [sglMarkets, bbMarkets] = await Promise.all([
    penroseContract.singularityMarkets(),
    penroseContract.bigBangMarkets(),
  ])

  return {
    sglMarkets,
    bbMarkets,
    tofts: await getToftsFromMarkets(sglMarkets.concat(bbMarkets), chainId),
  }
}
