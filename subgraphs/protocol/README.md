# Tapioca Protocol Subgraph

This repository contains subgraph instructions that map whole Tapioca protocol.

## Notes
- main purpose of this subgraph is to provide scientific data
- this goal of this subgraph is not synchronization performance rather code iteration speed - not suited for high velocity bots
- this subgraph is outdated and will be updated in the near future
- this subgraph was made mainly for Chaos Labs with requirements being as close as possible to [Aave subgraph](https://github.com/aave/protocol-subgraphs/blob/main/schemas/v3.schema.graphql) and/or [Messari subgraph](https://github.com/messari/subgraphs/blob/master/schema-lending.graphql)


## Setup

```bash
pnpm i
```

> Note: when running `graph codegen` (or `pnpm codegen`) remove changes done to `generated/TapiocaWrapper/TapiocaWrapper.ts`. Subgraph has an issue generating code for our wrapper.

## Deployment

### Supported networks
`[subgraph_chain_id] -> [chain_id]`
```
arbitrum-goerli ->  421613
fuji            ->  43113
fantom-testnet  ->  4002
mumbai          ->  80001
```

### Create subgraphs
Create subgraphs in hosted service with your subgraph account for all supported chains. Use following naming convetion when naming
subgraphs:

- For development: `tapioca-dev-protocol-[chain_id]` (example: `tapioca-dev-protocol-421613` for arbitrum goerli)
- For production: `tapioca-protocol-[chain_id]` (example: `tapioca-protocol-421613` for arbitrum goerli)

### Authenticate
```
graph auth --product hosted-service <ACCESS_TOKEN>
# or
npx graph auth --product hosted-service <ACCESS_TOKEN>
```

### Deploy
```
# DEV
bash deploy.sh
# PROD
bash deploy-prod.sh
```

For more info on deployment see [Subgraph docs](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/).

## Deployment URLs

Subgraphs are deployed on following subgraph hosted service URLs.

### Development
- [arbitrum-goerli](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-dev-protocol-421613)
- [fuji](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-dev-protocol-43113)
- [fantom-testnet](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-dev-protocol-4002)
- [mumbai](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-dev-protocol-80001)

### Production
- [arbitrum-goerli](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-protocol-421613)
- [fuji](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-protocol-43113)
- [fantom-testnet](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-protocol-4002)
- [mumbai](https://thegraph.com/hosted-service/subgraph/0xshippor/tapioca-protocol-80001)
