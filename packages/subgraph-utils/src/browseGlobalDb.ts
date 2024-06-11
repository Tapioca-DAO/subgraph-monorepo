import { readJsonSync } from "fs-extra"

type GDBInfo = {
  [tag: string]: {
    [repo: string]: {
      [chainId: string]: {
        contracts: { name: string; address: string }[]
      }
    }
  }
}

type ContractName = "PENROSE" | "TAP_TOKEN"
type RepoName = "tapioca-bar" | "tap-token" | "tapiocaz"

const gdb = readJsonSync("./src/_input/global.db.json") as GDBInfo

const parseWildcard = (pattern: string, stringToCheck: string): boolean => {
  if (pattern.endsWith("*")) {
    return stringToCheck.startsWith(pattern.slice(0, -1))
  }
  if (pattern.startsWith("*")) {
    return stringToCheck.endsWith(pattern.slice(0, -1))
  }

  return stringToCheck.includes(pattern)
}

export const browseGlobalDb = (
  tag: string,
  repo: RepoName,
  contractName: {
    pick?: ContractName
    pattern?: string
  },
) => {
  const contractsOut: { chainId: number; addresses: string[] }[] = []
  const chainIds = Object.keys(gdb[tag][repo])
  for (let i = 0; i < chainIds.length; i++) {
    const chainId = chainIds[i]
    const chainInfo = gdb[tag][repo][chainId]
    const contracts = chainInfo.contracts
    for (let j = 0; j < contracts.length; j++) {
      const contract = contracts[j]

      if (
        contractName.pick
          ? contract.name === contractName.pick
          : parseWildcard(contractName.pattern!, contract.name)
      ) {
        const numberChainId = parseInt(chainId)
        const outEntity = contractsOut.find((c) => c.chainId === numberChainId)
        if (!outEntity) {
          contractsOut.push({
            chainId: numberChainId,
            addresses: [contract.address],
          })
        } else {
          outEntity.addresses.push(contract.address)
        }
      }
    }
  }

  return contractsOut.filter((c) => c.addresses.length > 0)
}
