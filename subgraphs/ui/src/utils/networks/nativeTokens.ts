export class NativeTokenDefinition {
  chainId: number
  symbol: string
  name: string
  decimals: number

  static getTestnetStaticDefinitions(): Array<NativeTokenDefinition> {
    const staticDefinitions = [
      { chainId: 43113, decimals: 18, symbol: "AVAX", name: "Avalanche Fuji" },
      { chainId: 5, decimals: 18, symbol: "ETH", name: "Goerli Ether" },
      {
        chainId: 421613,
        decimals: 18,
        symbol: "ETH",
        name: "Arbitrum Goerli Ether",
      },
      { chainId: 80001, decimals: 18, symbol: "MATIC", name: "MATIC" },
      { chainId: 4002, decimals: 18, symbol: "FTM", name: "Fantom" },
    ] as Array<NativeTokenDefinition>

    return staticDefinitions
  }

  static getMainnetStaticDefinitions(): Array<NativeTokenDefinition> {
    const staticDefinitions = [
      { chainId: 1, decimals: 18, symbol: "ETH", name: "Ether" },
    ] as Array<NativeTokenDefinition>

    return staticDefinitions
  }

  static fromChainId(chainId: number): NativeTokenDefinition {
    const testnetDefinitions = this.getTestnetStaticDefinitions()
    const mainnetDefinitions = this.getTestnetStaticDefinitions()

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

    throw new Error("NativeTokenDefinition not found for current chain.")
  }
}
