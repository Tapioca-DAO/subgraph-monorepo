const chainIdLzId = [
  {
    chainId: 421614,
    lzId: 40231,
  },
  {
    chainId: 43113,
    lzId: 40106,
  },
  {
    chainId: 42161,
    lzId: 30110,
  },
  {
    chainId: 1,
    lzId: 30101,
  },
]

/**
 * Converts an EVM chain id to an LZ chain id
 * @param lzChainId LZ chain id
 * @returns EVM chain id
 */
export const lzChainIdToChainId = (lzChainId: number): number => {
  const chainId = chainIdLzId.find((c) => c.lzId === lzChainId)
  if (!chainId) {
    throw new Error(`Unsupported LZ chainId ${lzChainId}`)
  }
  return chainId.chainId
}

/**
 * Converts an EVM chain id to an LZ chain id
 * @param chainId EVM chain id
 * @returns LZ chain id
 */
export const chainIdToLzChainId = (chainId: number): number => {
  const lzId = chainIdLzId.find((c) => c.chainId === chainId)
  if (!lzId) {
    throw new Error(`Unsupported chainId ${chainId}`)
  }
  return lzId.lzId
}
