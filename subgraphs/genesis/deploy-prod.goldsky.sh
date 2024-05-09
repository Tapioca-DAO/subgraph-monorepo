pnpm build --network arbitrum-sepolia --skip-migrations
goldsky subgraph tag delete genesis-prod-421614/1.0.0 -t 421614
goldsky subgraph delete genesis-prod-421614/1.0.0
goldsky subgraph deploy genesis-prod-421614/1.0.0 --path . --start-block 41310428
