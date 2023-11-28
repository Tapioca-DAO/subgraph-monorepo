import { dataSource, log } from "@graphprotocol/graph-ts"

import { getNetworkId } from "./definition"

export class LzNetworkInfo {
  lzChainId: number
  chainId: number

  // https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
  static testnetLzChains: LzNetworkInfo[] = [
    // goerli
    { lzChainId: 10121, chainId: 5 },
    // bnb
    { lzChainId: 10102, chainId: 97 },
    // fuji
    { lzChainId: 10106, chainId: 43113 },
    // arbitrum goerli
    { lzChainId: 10143, chainId: 421613 },
    // polygon mumbai
    { lzChainId: 10109, chainId: 80001 },
    // fantom testnet
    { lzChainId: 10112, chainId: 4002 },
    // optimisim goerli
    { lzChainId: 10132, chainId: 420 },
  ]

  // https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
  static mainnetLzChains: LzNetworkInfo[] = [
    { lzChainId: 101, chainId: 1 }, // Ethereum
    { lzChainId: 102, chainId: 56 }, // BNB
    { lzChainId: 106, chainId: 42_161 }, // Avalanche
    { lzChainId: 108, chainId: 1 }, // Aptos mainnet has chain id 1
    { lzChainId: 109, chainId: 137 }, // Polygon
    { lzChainId: 110, chainId: 43_114 }, // Arbitrum
    { lzChainId: 111, chainId: 10 }, // Optimisim
    { lzChainId: 112, chainId: 250 }, // Fantom
    { lzChainId: 115, chainId: 53_935 }, // DFK
    { lzChainId: 116, chainId: 1_666_600_000 }, // Harmony
    { lzChainId: 118, chainId: 432_204 }, // Dexalot
    { lzChainId: 125, chainId: 42_220 }, // Celo
    { lzChainId: 126, chainId: 1_284 }, // Moonbeam
    { lzChainId: 138, chainId: 122 }, // Fuse
    { lzChainId: 145, chainId: 100 }, // Gnosis
    { lzChainId: 150, chainId: 8_217 }, // Klaytn
    { lzChainId: 151, chainId: 1_088 }, // Metis
    { lzChainId: 153, chainId: 1_116 }, // CoreDAO
    { lzChainId: 155, chainId: 66 }, // OKT (OKX)
    { lzChainId: 158, chainId: 1_101 }, // Polygon zkEVM
    { lzChainId: 159, chainId: 7_700 }, // Canto
    { lzChainId: 165, chainId: 324 }, // zkSync Era
    { lzChainId: 167, chainId: 1_285 }, // Moonriver
    { lzChainId: 167, chainId: 1_285 }, // Moonriver
    { lzChainId: 173, chainId: 1_559 }, // Tenet
    { lzChainId: 175, chainId: 42_170 }, // Arbitrum Nova
    { lzChainId: 176, chainId: 82 }, // Meter.io
    { lzChainId: 161, chainId: 58_008 }, // Sepolia
    { lzChainId: 177, chainId: 2_222 }, // Kava
    { lzChainId: 183, chainId: 59_144 }, // Linea
    { lzChainId: 184, chainId: 8_453 }, // Base
    { lzChainId: 181, chainId: 5_000 }, // Mantle
    { lzChainId: 197, chainId: 5_151_706 }, // Loot
    { lzChainId: 198, chainId: 4_337 }, // MeritCircle (aka Beam)
    { lzChainId: 195, chainId: 7_777_777 }, // Zora

    { lzChainId: 154, chainId: 5 }, // Goerli - this is only for https://testnetbridge.com/

    // ! there are more chains, but they are not documented in LZ docs
  ]

  static currentChain(): LzNetworkInfo {
    const testnetDefinitions = this.testnetLzChains
    const mainnetDefinitions = this.mainnetLzChains
    const chainId = getNetworkId(dataSource.network())

    for (let i = 0; i < mainnetDefinitions.length; i++) {
      const staticDefinition = mainnetDefinitions[i]
      if (staticDefinition.chainId == chainId) {
        return staticDefinition
      }
    }

    for (let i = 0; i < testnetDefinitions.length; i++) {
      const staticDefinition = testnetDefinitions[i]
      if (staticDefinition.chainId == chainId) {
        return staticDefinition
      }
    }

    throw new Error("Current chain is not supported")
  }

  static chainFromLz(lzChainId: number, txHash: string): LzNetworkInfo {
    const testnetDefinitions = this.testnetLzChains
    const mainnetDefinitions = this.mainnetLzChains

    for (let i = 0; i < mainnetDefinitions.length; i++) {
      const staticDefinition = mainnetDefinitions[i]
      if (staticDefinition.lzChainId == lzChainId) {
        return staticDefinition
      }
    }

    for (let i = 0; i < testnetDefinitions.length; i++) {
      const staticDefinition = testnetDefinitions[i]
      if (staticDefinition.lzChainId == lzChainId) {
        return staticDefinition
      }
    }

    log.warning("Chain from LZ - Current chain is not supported {}-{}", [
      lzChainId.toString(),
      txHash,
    ])
    return {
      lzChainId,
      chainId: 0,
    }
  }
}
