pnpm build --network arbitrum-goerli --skip-migrations
goldsky subgraph tag delete genesis-dev-421613/1.0.0 -t 421613
goldsky subgraph delete genesis-dev-421613/1.0.0
goldsky subgraph deploy genesis-dev-421613/1.0.0 --path . --start-block 49293101
