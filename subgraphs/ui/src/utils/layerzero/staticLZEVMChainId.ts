export class StaticChainIdDefinition {
  lzChainId: number
  chainId: number

  static getTestnetStaticDefinitions(): Array<StaticChainIdDefinition> {
    // https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
    const staticDefinitions = [
      { lzChainId: 10106, chainId: 43113 },
      { lzChainId: 10121, chainId: 5 },
      { lzChainId: 10143, chainId: 421613 },
      { lzChainId: 10109, chainId: 80001 },
      { lzChainId: 10112, chainId: 4002 },
    ] as Array<StaticChainIdDefinition>

    return staticDefinitions
  }

  static getMainnetStaticDefinitions(): Array<StaticChainIdDefinition> {
    const staticDefinitions = [
      { lzChainId: 101, chainId: 1 },
    ] as Array<StaticChainIdDefinition>

    return staticDefinitions
  }

  static fromLzChainId(lzChainId: number): StaticChainIdDefinition | null {
    const testnetDefinitions = this.getTestnetStaticDefinitions()
    const mainnetDefinitions = this.getTestnetStaticDefinitions()

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

    // If not found, return null
    return null
  }
}
