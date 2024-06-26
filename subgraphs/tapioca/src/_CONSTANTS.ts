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
          "0x905EeDBc5e584E11B68f60E1deB50Efa08aD3e9F",
          "0x62b1974CC9b66BBB307B21Bd176c9b5C5a86515a",
          "0x1B460E311753fDB46451EF3d11d7B9eE5542b369",
          "0xf8AC713c5FD9603891B53Bc9caC53Adee7bbC6Ac",
          "0x2EAe4fbc552fE35C1D3Df2B546032409bb0E431E",
          "0xF3b33c02e39ACA9b34ff67bB738A1242f8B1631e",
          "0x518746126A545cC7F31EeD92bF2b04eb99eD103B",
          "0xc9c8f2823c788CE9b76596263c00844F70d64e47",
          "0x568567fb156cDf083FA9e4A672fB462aA49673e9",
          "0x3488d6fc4293E7954853ea2196580c9D3973ac3d",
          "0x7C3A083a61955519C15C4e89792dAF0C6bA37734",
          "0x964F75A175e31ee1554F852Da09Fbf19f49D6faF",
        ],
      },
      // {
      //   chainId: 11155420,
      //   addresses: ["0x15777E4ce87A213A0C10c0C0e06f4aFF8995e960"],
      // },
      {
        chainId: 43113,
        addresses: [
          "0x5AfCE7955b532C3e31873A5B1A248ccFD6a29201",
          "0x453AcCDfB7f63D6c26Fb47a381f53B6047A8ca94",
          "0xed18DBCb2810E4178c23668794198C81B0668b23",
          "0x696C42De6c623f75B1fB376531A5ebBb6e250B34",
          "0xCE05af7568330A8F37f9707f24fB63bC0bC21455",
        ],
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
        addresses: ["0x56F147211d835272B24020B41543B76011d61676"],
      },
      {
        chainId: 43113,
        addresses: ["0xce441b7f37762eeAC37B9fAb819D4b6479779632"],
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
          "0x8B78E0Fdd67BC414F631Bb7A241474887cA0a523",
          "0x67Ea8a6F9854e659C95e1d488e0c1525F6e8A5Fb",
          "0x72E77fa6789Fe85b7EBD4931e3DB4c4FC974E70A",
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

    throw new Error(
      `No TOFT addresses found for current network ${dataSource.network()}`,
    )
  }
}
