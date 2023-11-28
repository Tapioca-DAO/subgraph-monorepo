echo Please enter your subgraph github username
read GITHUB_USERNAME
pnpm run deploy:thegraph $GITHUB_USERNAME/genesis-421613 --network arbitrum-goerli