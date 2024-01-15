echo Please enter your subgraph github username
read GITHUB_USERNAME
# pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-dev-ui-43113 --network fuji
# pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-dev-ui-80001 --network mumbai
pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-dev-ui-421614 --network arbitrum-sepolia
pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-dev-ui-4002 --network fantom-testnet