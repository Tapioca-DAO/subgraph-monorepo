echo Please enter your subgraph github username
read GITHUB_USERNAME
pnpm run deploy:thegraph $GITHUB_USERNAME/genesis-dev-421614 --network arbitrum-sepolia