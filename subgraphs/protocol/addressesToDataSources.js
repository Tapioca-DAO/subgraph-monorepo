const fs = require("fs-extra")
const YAML = require("yaml")
const { program } = require("commander")

const chainIdToName = {
  4002: "fantom-testnet",
  421614: "arbitrum-sepolia",
  42161: "arbitrum-one",
}

program.option("-c, --chainId <id>")

program.parse()
const options = program.opts()
const chainId = parseInt(options.chainId)
const chainName = chainIdToName[chainId]
if (!chainName) {
  console.error("Chain not found")
  process.exit(1)
}

const networksJson = fs.readJSONSync("networks.json")
const contracts = Object.entries(networksJson[chainName])

const contextJson = {}
for (let i = 0; i < contracts.length; i++) {
  const [contractName, value] = contracts[i]
  contextJson[contractName.toLowerCase() + "_address"] = {
    type: "String",
    data: value.address.toLowerCase(),
  }
}

const file = fs.readFileSync("./subgraph.yaml", "utf8")
const _subgraphYamlData = YAML.parse(file)

const subgraphYamlData = { ..._subgraphYamlData }

for (let i = 0; i < subgraphYamlData.dataSources.length; i++) {
  subgraphYamlData.dataSources[i] = {
    ...subgraphYamlData.dataSources[i],
    context: contextJson,
  }
}

fs.writeFileSync("./subgraph.yaml", YAML.stringify(subgraphYamlData))
