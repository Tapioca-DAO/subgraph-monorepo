export const STORE: {
  toftAddresses: Record<number, Set<string>>
  tokenAddresses: Record<number, Set<string>>
  output: {
    tokens: TokenBaseData[]
    markets: {
      singularityMarkets: MarketBaseData[]
      bigBangMarkets: MarketBaseData[]
    }
  }
} = {
  toftAddresses: {},
  tokenAddresses: {},
  output: {
    tokens: [],
    markets: {
      singularityMarkets: [],
      bigBangMarkets: [],
    },
  },
}

export const initStore = (supportedChains: number[]) => {
  for (let i = 0; i < supportedChains.length; i++) {
    STORE.toftAddresses[supportedChains[i]] = new Set()
    STORE.tokenAddresses[supportedChains[i]] = new Set()
  }
}

export type MarketBaseData = {
  chainId: number
  address: string
  type: "SGL" | "BB"
  oracleAddress: string
  collateralToken: TokenDefinition
  borrowToken: TokenDefinition
  tolpLockSglYbId?: number
  tSglAddress?: string
}

export type TokenDefinition = {
  chainId: number
  address: string
}

export type TokenBaseData = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  supportsEip2612?: boolean
  toftDefinitions?: ToftDefinitions
}

export interface ToftDefinitions {
  underlying?: TokenDefinition
  remotes: TokenDefinition[]
}
