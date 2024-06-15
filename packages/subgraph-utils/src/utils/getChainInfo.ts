import { readJsonSync } from "fs-extra"

type ChainInfo = {
  name: string
  rpc: string[]
  chainId: number
}

// from https://chainid.network/chains.json
const chainInfos = readJsonSync("./src/utils/chains.json") as ChainInfo[]

/**
 * Get chain info for a given chain id. Used to get rpc urls for a given chain.
 * @param chainId chain id
 * @returns name of the chain, rpc urls and chain id
 */
export const getChainInfo = (chainId: number): ChainInfo => {
  const chainInfo = chainInfos.find(
    (chainInfo) => chainInfo.chainId === chainId,
  )

  if (!chainInfo) {
    throw new Error(`Chain with id ${chainId} not found`)
  }
  chainInfo.rpc = chainInfo.rpc.filter((rpc) => !rpc.includes("${"))
  return chainInfo
}
