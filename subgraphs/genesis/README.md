# Genesis Subgraph

This repository contains subgraph instructions for APIs required by Genesis UI.

## Setup

```bash
pnpm i
pnpm codegen
```

## Deployment
### Authentication
`graph auth --product hosted-service <ACCESS_TOKEN>` or `pnpx graph auth --product hosted-service <ACCESS_TOKEN>`

### Deployment
`bash deploy.sh` or for production `bash deploy-prod.sh`

**Supported Networks**
```
arbitrum goerli
```

For more info on deployment see [Subgraph docs](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/).