import { readJsonSync } from "fs-extra"

type ChainInfo = {
  name: string
  rpc: string[]
  chainId: number
}

const chainInfos = readJsonSync("./src/chains.json") as ChainInfo[]

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
