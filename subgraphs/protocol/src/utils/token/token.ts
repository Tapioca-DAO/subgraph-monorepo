import { Address, BigInt } from "@graphprotocol/graph-ts"

import { ERC20 } from "../../../generated/Penrose/ERC20"
import { ERC20NameBytes } from "../../../generated/Penrose/ERC20NameBytes"
import { ERC20SymbolBytes } from "../../../generated/Penrose/ERC20SymbolBytes"
import { Token } from "../../../generated/schema"

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  )
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  const contract = ERC20.bind(tokenAddress)
  const contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)

  // try types string and bytes32 for symbol
  let symbolValue = "unknown"
  const symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      } else {
        throw new Error("Symbol not found")
        // // try with the static definition
        // const staticTokenDefinition =
        //   StaticTokenDefinition.fromAddress(tokenAddress)
        // if (staticTokenDefinition != null) {
        //   symbolValue = staticTokenDefinition.symbol
        // }
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function fetchTokenName(tokenAddress: Address): string {
  const contract = ERC20.bind(tokenAddress)
  const contractNameBytes = ERC20NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = "unknown"
  const nameResult = contract.try_name()
  if (nameResult.reverted) {
    const nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      } else {
        throw new Error("Name not found")
        // // try with the static definition
        // const staticTokenDefinition =
        //   StaticTokenDefinition.fromAddress(tokenAddress)
        // if (staticTokenDefinition != null) {
        //   nameValue = staticTokenDefinition.name
        // }
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  const contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = -1 as i32
  const decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  } else {
    throw new Error("decimals not found" + tokenAddress.toHexString())
    // // try with the static definition
    // const staticTokenDefinition =
    //   StaticTokenDefinition.fromAddress(tokenAddress)
    // if (staticTokenDefinition != null) {
    //   return staticTokenDefinition.decimals
    // }
  }

  return BigInt.fromI32(decimalValue as i32)
}

export function putToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHexString())
  if (token === null) {
    token = new Token(tokenAddress.toHexString())
  }
  token.address = tokenAddress
  token.symbol = fetchTokenSymbol(tokenAddress)
  token.name = fetchTokenName(tokenAddress)
  token.decimals = fetchTokenDecimals(tokenAddress)

  token.save()
  return token
}

export function getToken(tokenAddress: Address): Token | null {
  return Token.load(tokenAddress.toHexString())
}
