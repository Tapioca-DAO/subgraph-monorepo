import { dataSource, log } from "@graphprotocol/graph-ts"

import { getNetworkId } from "./utils/networks/definition"

export class ContractAddressesConstants {
  chainId: number
  addresses: string[]

  /**
   * ADJUST THIS VALUE
   * List of addresses of all the TOFT contracts.
   */
  static getFullToftList(): Array<ContractAddressesConstants> {
    return [
      {
        chainId: 421614,
        addresses: [
          "0xEd6D90A2e0e106eDecCa2D22eD4d91580C02B782",
          "0x518dd2F7b19f05e47eb8c24E5E93edF7587595d8",
          "0x57fe12B8303A296Ebc9280Eaa702281829a2A6fd",
          "0xcFA3E22c90ccDA74ddd665eF10f56710f89511f4",
          "0xf1dA970B57c5B575d40478223BF328BF1E6c05DD",
        ],
      },
      {
        chainId: 11155420,
        addresses: ["0x15777E4ce87A213A0C10c0C0e06f4aFF8995e960"],
      },
    ] as Array<ContractAddressesConstants>
  }

  /**
   * ADJUST THIS VALUE
   * List of addresses of the markets.
   */
  static getFullSingularityList(): Array<ContractAddressesConstants> {
    return [
      {
        chainId: 421614,
        addresses: ["0x1e54280A84312bf13E60C0B10195F2411F8C75a8"],
      },
    ] as Array<ContractAddressesConstants>
  }

  /**
   * ADJUST THIS VALUE
   * List of addresses of the markets.
   */
  static getFullBigBangList(): Array<ContractAddressesConstants> {
    return [
      {
        chainId: 421614,
        addresses: [
          "0x847eAEDeE2df4C84c29B0A7b50d44599bC45E917",
          "0x388b2D02bDBc58Fefd4B1927B04746C4bb1ec571",
          "0x3D1B2Fe2adBAA38FF3C46eABa6a42958707cfeaB",
        ],
      },
    ] as Array<ContractAddressesConstants>
  }

  static getMarketListForCurrentNetwork(fetchSingularity: boolean): string[] {
    const networkId = getNetworkId(dataSource.network())

    const testnetDefinitions = fetchSingularity
      ? this.getFullSingularityList()
      : this.getFullBigBangList()

    for (let i = 0; i < testnetDefinitions.length; i++) {
      const staticDefinition = testnetDefinitions[i]
      if (staticDefinition.chainId == networkId) {
        return staticDefinition.addresses
      }
    }

    log.warning("No Market addresses found for current network", [])
    return []
  }

  static isMarketBigBang(address: string): bool {
    const networkId = getNetworkId(dataSource.network())

    const bbMarketList = this.getFullBigBangList()

    for (let i = 0; i < bbMarketList.length; i++) {
      const staticDefinition = bbMarketList[i]
      if (staticDefinition.chainId == networkId) {
        for (let j = 0; j < staticDefinition.addresses.length; j++) {
          const _add = staticDefinition.addresses[j]
          if (_add.toLowerCase() == address.toLowerCase()) {
            return true
          }
        }
      }
    }

    return false
  }

  static getToftListForCurrentNetwork(): string[] {
    const networkId = getNetworkId(dataSource.network())

    const testnetDefinitions = this.getFullToftList()

    for (let i = 0; i < testnetDefinitions.length; i++) {
      const staticDefinition = testnetDefinitions[i]
      if (staticDefinition.chainId == networkId) {
        return staticDefinition.addresses
      }
    }

    throw new Error("No TOFT addresses found for current network")
  }
}
