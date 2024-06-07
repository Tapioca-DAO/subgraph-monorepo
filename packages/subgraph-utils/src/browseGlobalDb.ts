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

type ContractName = "PENROSE"

const gdb = readJsonSync("./src/_input/global.db.json") as GDBInfo

export const browseGlobalDb = (
  tag: string,
  repo: string,
  contractName: ContractName,
) => {
  const contractsOut: { chainId: number; addresses: string[] }[] = []
  const chainIds = Object.keys(gdb[tag][repo])
  for (let i = 0; i < chainIds.length; i++) {
    const chainId = chainIds[i]
    const chainInfo = gdb[tag][repo][chainId]
    const contracts = chainInfo.contracts
    for (let j = 0; j < contracts.length; j++) {
      const contract = contracts[j]
      if (contract.name === contractName) {
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
