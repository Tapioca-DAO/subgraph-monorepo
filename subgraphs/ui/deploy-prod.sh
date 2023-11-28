echo Please enter your subgraph github username
read GITHUB_USERNAME
pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-markets-43113 --network fuji
pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-markets-80001 --network mumbai
pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-markets-421613 --network arbitrum-goerli
pnpm run deploy:thegraph $GITHUB_USERNAME/tapioca-markets-4002 --network fantom-testnet