source _scripts/chainNames.sh

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
NAME=$(node -p -e "require('./package.json').name")
REDEPLOY=false

if [ "$2" == "-r" ]; then
  REDEPLOY=true
fi

if [ -z "$1" ]; then
  echo "Please provide a network: deploy [CHAIN_ID]"
  exit 1
fi

if [ -z "$CHAIN_NAMES[$1]" ]; then
  echo "Unknown network: $1"
  exit 1
fi

CHAIN_ID=$1
CHAIN_NAME=${CHAIN_NAMES[$CHAIN_ID]}
SUBGRAPH_NAME=$NAME-$CHAIN_ID/$PACKAGE_VERSION
START_BLOCK=$(grep -oP '(?<="startBlock": )[^,]*' ./networks.json | head -1)

if [ $REDEPLOY == true ]; then
  echo "Redeploying subgraph $SUBGRAPH_NAME on $CHAIN_NAME stating from block $START_BLOCK"
else 
  echo "Deploying subgraph $SUBGRAPH_NAME on $CHAIN_NAME stating from block $START_BLOCK"
fi



pnpm prepare:addresses -c $CHAIN_ID
pnpm build --network $CHAIN_NAME --skip-migrations

if [ $REDEPLOY == true ]; then
  goldsky subgraph delete $SUBGRAPH_NAME
fi

goldsky subgraph deploy $SUBGRAPH_NAME --path . --start-block $START_BLOCK
