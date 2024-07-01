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
      address: "0x21c9e7025373fac623327b67321bf40833dd23A6",
      chainId: 42161,
    },
    // yieldbox
    {
      contractName: "yieldbox",
      address: "0xCFFd997DB053c0fC54010770b55A4E02B1D104a5",
      chainId: 42161,
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
