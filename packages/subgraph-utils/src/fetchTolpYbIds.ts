import assert from "assert"

import { TOFT__factory, TOLP__factory } from "./typechain"
import { getProvider } from "./utils/getProvider"
import { lzChainIdToChainId } from "./utils/lzChainId"

export const fetchTolpYbIds = async (
  tolps: {
    chainId: number
    addresses: string[]
  }[],
) => {
  assert(tolps.length === 1, "Only one TOLP is supported in chains")
  assert(tolps[0].addresses.length === 1, "Only one TOLP is supported in chain")

  const chainId = tolps[0].chainId
  const tolpAddress = tolps[0].addresses[0]

  const tolpContract = TOLP__factory.connect(tolpAddress, getProvider(chainId))

  const sglYbIds = await tolpContract.getSingularities()

  const tolpMarketYbMetadata: {
    marketAddress: string
    marketChainId: number
    tolpTsglYbId: number
  }[] = []

  for (let i = 0; i < sglYbIds.length; i++) {
    const sglYbId = sglYbIds[i]
    const tSglAddress = await tolpContract.sglAssetIDToAddress(sglYbId)
    //const sglData = await tolpContract.activeSingularities(tSglAddress)

    const tSglContract = TOFT__factory.connect(
      tSglAddress,
      getProvider(chainId),
    )
    const sglAddress = await tSglContract.erc20()
    const hostLzId = await tSglContract.hostEid()
    const marketChainId = lzChainIdToChainId(Number(hostLzId))

    console.log({
      marketAddress: sglAddress,
      marketChainId,
      tolpTsglYbId: Number(sglYbId),
    })
    tolpMarketYbMetadata.push({
      marketAddress: sglAddress,
      marketChainId,
      tolpTsglYbId: Number(sglYbId),
    })
  }

  return tolpMarketYbMetadata
}
