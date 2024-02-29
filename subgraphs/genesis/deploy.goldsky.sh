pnpm build --network arbitrum-sepolia --skip-migrations
goldsky subgraph tag delete genesis-dev-421614/1.0.0 -t 421614
goldsky subgraph delete genesis-dev-421614/1.0.0
goldsky subgraph deploy genesis-dev-421614/1.0.0 --path . --start-block 4865250
