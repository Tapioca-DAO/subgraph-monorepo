echo Please enter your subgraph github username
read GITHUB_USERNAME
pnpm run deploy $GITHUB_USERNAME/tapioca-dev-protocol-43113 --network fuji
pnpm run deploy $GITHUB_USERNAME/tapioca-dev-protocol-80001 --network mumbai
pnpm run deploy $GITHUB_USERNAME/tapioca-dev-protocol-421613 --network arbitrum-goerli
pnpm run deploy $GITHUB_USERNAME/tapioca-dev-protocol-4002 --network fantom-testnet