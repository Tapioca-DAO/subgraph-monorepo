import { Address } from "@graphprotocol/graph-ts"

export class StaticMarketFilter {
  static getTestnetSGLAddresses(): Array<Address> {
    const staticDefinitions = [] as Array<Address>

    return staticDefinitions
  }

  static getTestnetBBAddresses(): Array<Address> {
    const staticDefinitions = [] as Array<Address>

    return staticDefinitions
  }

  static isPermittedSGL(registeredMarketAddress: Address): boolean {
    const testnetAddresses = this.getTestnetSGLAddresses()
    if (testnetAddresses.length == 0) {
      return true
    }

    for (let i = 0; i < testnetAddresses.length; i++) {
      const address = testnetAddresses[i]
      if (address == registeredMarketAddress) {
        return true
      }
    }

    // If not found, return null
    return false
  }

  static isPermittedBB(registeredMarketAddress: Address): boolean {
    const testnetAddresses = this.getTestnetBBAddresses()
    if (testnetAddresses.length == 0) {
      return true
    }

    for (let i = 0; i < testnetAddresses.length; i++) {
      const address = testnetAddresses[i]
      if (address == registeredMarketAddress) {
        return true
      }
    }

    // If not found, return null
    return false
  }
}
