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

type ContractName =
  | "PENROSE"
  | "TAP_TOKEN"
  | "TAPIOCA_OPTION_LIQUIDITY_PROVISION"
  | "YieldBox"
  | "MAGNETAR"
  | "MAGNETAR_HELPER"
  | "MARKET_HELPER"
  | "USDO_HELPER"
  | "PEARLMIT"
  | "OTAP"
  | "TAPIOCA_OPTION_BROKER"
  | "TWTAP"

type RepoName =
  | "tapioca-bar"
  | "tap-token"
  | "tapiocaz"
  | "yieldbox"
  | "tapioca-periph"

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

/**
 * Browse the global database for a given tag, repo, contract name and supported chains
 * @param tag deployment tag
 * @param repo deployment repo of the contract
 * @param contractName contract name to look for
 * @param supportedChains list of supported chains
 * @returns list of contract addresses for the given tag, repo, contract name and supported chains
 */
export const browseGlobalDb = (
  tag: string,
  repo: RepoName,
  contractName: {
    pick?: ContractName
    pattern?: string
  },
  supportedChains?: number[],
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

  const filteredContractsOut = contractsOut
    .filter((c) => c.addresses.length > 0)
    .filter((c) =>
      supportedChains?.length ? supportedChains.includes(c.chainId) : true,
    )

  if (supportedChains?.length) {
    return supportedChains
      .map((chainId) => filteredContractsOut.find((c) => c.chainId === chainId))
      .filter((x) => x) as {
      chainId: number
      addresses: string[]
    }[]
  }

  return filteredContractsOut
}
