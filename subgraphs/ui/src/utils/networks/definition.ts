import { Network } from "./constants"

// mainnets
export const ETH_NETWORK = "mainnet"
export const FTM_NETWORK = "fantom"
export const ARB_NETWORK = "arbitrum-one"
export const BSC_NETWORK = "bsc"
export const AVALANCHE_NETWORK = "avalanche"

// testnets
export const ARBITRUM_GOERLI = "arbitrum-goerli"
export const ARBITRUM_SEPOLIA = "arbitrum-sepolia"
export const MUMBAI = "mumbai"
export const FANTOM_TESTNET = "fantom-testnet"
export const AVALANCHE_FUJI = "fuji"

export function getNetworkId(network: string): number {
  if (network == ETH_NETWORK) {
    return 1
  } else if (network == AVALANCHE_NETWORK) {
    return 43114
  } else if (network == ARB_NETWORK) {
    return 42161
  } else if (network == FTM_NETWORK) {
    return 250
  } else if (network == BSC_NETWORK) {
    return 56
  } else if (network == ARBITRUM_GOERLI) {
    return 421613
  } else if (network == ARBITRUM_SEPOLIA) {
    return 421614
  } else if (network == MUMBAI) {
    return 80001
  } else if (network == FANTOM_TESTNET) {
    return 4002
  } else if (network == AVALANCHE_FUJI) {
    return 43113
  }
  return 0
}

export function getNetwork(network: string): string {
  if (network == ETH_NETWORK) {
    return Network.MAINNET
  } else if (network == AVALANCHE_NETWORK) {
    return Network.AVALANCHE
  } else if (network == ARB_NETWORK) {
    return Network.ARBITRUM_ONE
  } else if (network == FTM_NETWORK) {
    return Network.FANTOM
  } else if (network == BSC_NETWORK) {
    return Network.BSC
  } else if (network == ARBITRUM_GOERLI) {
    return Network.ARBITRUM_GOERLI
  } else if (network == ARBITRUM_SEPOLIA) {
    return Network.ARBITRUM_SEPOLIA
  } else if (network == MUMBAI) {
    return Network.MUMBAI
  } else if (network == FANTOM_TESTNET) {
    return Network.FANTOM_TESTNET
  } else if (network == AVALANCHE_FUJI) {
    return Network.AVALANCHE_FUJI
  }
  return ""
}
