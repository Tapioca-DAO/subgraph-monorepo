# Tapioca Subgraph

This repository contains subgraph instructions for APIs required by UI (and other parts of protocol).

## Setup

```bash
yarn
yarn codegen
```

## Deployment

```
graph auth --product hosted-service <ACCESS_TOKEN>
or
npx graph auth --product hosted-service <ACCESS_TOKEN>

yarn deploy <SUBGRAPH_NAME> --network <SUPPORTED_NETWORK_NAME>
```
*Note: default deployment script is set to hoster service.*

**Supported Networks**
```
goerli
fantom-testnet
```

For more info on deployment see [Subgraph docs](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/).