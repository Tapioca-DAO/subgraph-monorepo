import { Address, dataSource } from "@graphprotocol/graph-ts"

import { getNetworkId } from "../utils/protocol/networks"

export class StaticContractDefinition {
  contractName: string
  chainId: number
  address: string

  static testnetContracts: StaticContractDefinition[] = [
    // magnetar_helper
    {
      contractName: "magnetar_helper",
      address: "0x706D724cED28142873D2bbc79345f051763FFcDB",
      chainId: 421613,
    },
    {
      contractName: "magnetar_helper",
      address: "0x8441aEC51136cAB903A0FfB2B657d3c9D3925223",
      chainId: 4002,
    },
    // yieldbox
    {
      contractName: "yieldbox",
      address: "0x36dF846354244ACcCBabb79c0F5942C94EE27091",
      chainId: 421613,
    },
    {
      contractName: "yieldbox",
      address: "0x9628067e507Ad43D5e686C2B5fc6AE085Cb67aEb",
      chainId: 4002,
    },
  ]

  /**
   *
   * @param contractName "magnetar_helper" | "yieldbox"
   * @returns contract address of that contract on the current chain
   */
  static currentChain(contractName: string): Address {
    const testnetContracts = this.testnetContracts

    const chainId = getNetworkId(dataSource.network())

    for (let i = 0; i < testnetContracts.length; i++) {
      const testnetContract = testnetContracts[i]
      if (
        testnetContract.chainId == chainId &&
        testnetContract.contractName == contractName
      ) {
        return Address.fromBytes(Address.fromHexString(testnetContract.address))
      }
    }

    throw new Error("Current chain is not supported")
  }
}
