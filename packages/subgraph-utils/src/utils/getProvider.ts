import { ethers } from "ethers"

import { getChainInfo } from "./getChainInfo"

const providers: { [chainId: number]: ethers.JsonRpcProvider } = {}

/**
 * Returns an ethers provider for a given chain id
 * @param chainId chain id to get the provider for
 * @returns ethers provider for the given chain id
 */
export const getProvider = (chainId: number) => {
  if (!providers[chainId]) {
    const chainInfo = getChainInfo(chainId)
    const rpc = chainInfo.rpc[0]
    providers[chainId] = new ethers.JsonRpcProvider(rpc)
    console.log(
      `Using ${chainInfo.name} with chainId ${chainInfo.chainId} and rpc ${rpc}`,
    )
  }
  return providers[chainId]
}
