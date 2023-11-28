import { Address } from "@graphprotocol/graph-ts"

export class StaticMarketFilter {
  static getTestnetSGLAddresses(): Array<Address> {
    const staticDefinitions = [
      //Address.fromString("0xe109d7F7ed2B033AF6F50c227CC7145923F8a05e"),
      //Address.fromString("0xcb7D0B7E2CC950706e3002B50476d854DCBd5483"),
      //Address.fromString("0x3Cb2bFC466Da75011537f4078be5d58d928625D6"),
      //Address.fromString("0xb9b788Bcc18d562920cCF65Bb09AacA296aADF22"),
    ] as Array<Address>

    return staticDefinitions
  }

  static getTestnetBBAddresses(): Array<Address> {
    const staticDefinitions = [
      //Address.fromString("0x61490D11b7cDB0C2573966635731C0dd5F687088"),
      //Address.fromString("0x44c393898170B18A162e0B71f18E9eBdcB9f6cd7"),
      //Address.fromString("0x01237547EF211A72d7a29269f7530E2d396a03aF"),
      //Address.fromString("0x129E63aA37a25F15E8e0969674E90e58840485f2"),
    ] as Array<Address>

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
