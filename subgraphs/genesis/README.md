# Genesis subgraph

This repository contains subgraph instructions for APIs required by Genesis app.

## Setup 
- add addresses to `networks.json`
- add addresses to `src/_CONSTANTS.ts` according to the comments

## Deployment

- deploy - `deploy:gs [chainId]`
- redeploy - `deploy:gs [chainId] -r`

- add tag - `tag:create [chainId] [dev|prod]`
- add tag - `tag:delete [chainId] [dev|prod]`

For more info on deployment see [Goldsky docs](https://docs.goldsky.com/subgraphs/introduction).