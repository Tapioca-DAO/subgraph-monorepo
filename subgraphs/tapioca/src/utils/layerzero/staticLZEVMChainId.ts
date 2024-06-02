export class StaticChainIdDefinition {
  lzChainId: number
  chainId: number

  static getTestnetStaticDefinitions(): Array<StaticChainIdDefinition> {
    // https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
    const staticDefinitions = [
      { lzChainId: 40106, chainId: 43113 },
      { lzChainId: 40109, chainId: 80001 },
      { lzChainId: 40112, chainId: 4002 },
      { lzChainId: 40231, chainId: 421614 },
      { lzChainId: 40232, chainId: 11155420 },
    ] as Array<StaticChainIdDefinition>

    return staticDefinitions
  }

  static getMainnetStaticDefinitions(): Array<StaticChainIdDefinition> {
    const staticDefinitions = [
      { lzChainId: 30101, chainId: 1 },
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

  static fromChainId(chainId: number): StaticChainIdDefinition | null {
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

    // If not found, return null
    return null
  }
}
