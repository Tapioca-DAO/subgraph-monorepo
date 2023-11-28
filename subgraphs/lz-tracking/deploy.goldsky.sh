yarn build --network arbitrum-one --skip-migrations
goldsky subgraph tag delete lz-message-tracking-dev-42161/1.0.0E -t 42161
goldsky subgraph delete lz-message-tracking-dev-42161/1.0.0E
goldsky subgraph deploy lz-message-tracking-dev-42161/1.0.0E --path . --start-block 132794640

yarn build --network avalanche --skip-migrations
goldsky subgraph tag delete lz-message-tracking-dev-43114/1.0.0E -t 43114
goldsky subgraph delete lz-message-tracking-dev-43114/1.0.0E
goldsky subgraph deploy lz-message-tracking-dev-43114/1.0.0E --path . --start-block 35421455

yarn build --network bsc --skip-migrations
goldsky subgraph tag delete lz-message-tracking-dev-56/1.0.0E -t 56
goldsky subgraph delete lz-message-tracking-dev-56/1.0.0E
goldsky subgraph deploy lz-message-tracking-dev-56/1.0.0E --path . --start-block 31902666

yarn build --network optimism --skip-migrations
goldsky subgraph tag delete lz-message-tracking-dev-10/1.0.0E -t 10
goldsky subgraph delete lz-message-tracking-dev-10/1.0.0E
goldsky subgraph deploy lz-message-tracking-dev-10/1.0.0E --path . --start-block 109800257

yarn build --network mainnet --skip-migrations
goldsky subgraph tag delete lz-message-tracking-dev-1/1.0.0E -t 1
goldsky subgraph delete lz-message-tracking-dev-1/1.0.0E
goldsky subgraph deploy lz-message-tracking-dev-1/1.0.0E --path . --start-block 18175976
