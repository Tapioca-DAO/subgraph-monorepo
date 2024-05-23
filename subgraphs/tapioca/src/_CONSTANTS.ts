import { dataSource } from "@graphprotocol/graph-ts"

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
          "0xd9bfC7F2a257b71a97bf6677adEe60c4e02be768",
          "0xDC3510da0589C17097dD785A2bB1d15196331D95",
          "0x27b598b915bD978AdcE22DCC611Da43fa1a9022f",
        ],
      },
    ] as Array<ContractAddressesConstants>
  }

  /**
   * ADJUST THIS VALUE
   * List of addresses of the whitelisted markets.
   * This is to filter out the markets that had deployment issues.
   * If empty, all markets will be available on subgraph.
   */
  static getWhiteListedMarketsList(): Array<ContractAddressesConstants> {
    return [
      {
        chainId: 421614,
        addresses: [
          "0xdfD1e18D0F86ef02B728Da791D6d146b03915348",
          "0x31D7dd320053c929363f91F3f9e53dF14abD7890",
        ],
      },
    ] as Array<ContractAddressesConstants>
  }

  static isMarketWhitelisted(address: string): bool {
    const networkId = getNetworkId(dataSource.network())

    const whitelistedMarketList = this.getWhiteListedMarketsList()

    for (let i = 0; i < whitelistedMarketList.length; i++) {
      const staticDefinition = whitelistedMarketList[i]
      if (staticDefinition.chainId == networkId) {
        return staticDefinition.addresses.includes(address)
      }
    }

    return true
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

    throw new Error("No TOFT addresses found for network")
  }
}
