pnpm prepare:addresses -c 421614
pnpm build --network arbitrum-sepolia --skip-migrations
goldsky subgraph tag delete tapioca-ui-dev-421614/1.0.0 -t 421614
goldsky subgraph delete tapioca-ui-dev-421614/1.0.0
goldsky subgraph deploy tapioca-ui-dev-421614/1.0.0 --path . --start-block 4954220
