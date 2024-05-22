PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
NAME=$(node -p -e "require('./package.json').name")



if [ -z "$1" ]; then
  echo "Please provide a network: tag [CHAIN_ID] [prod|dev]"
  exit 1
fi

if [ -z "$2" ]; then
  echo "Please provide a tag: tag [CHAIN_ID] [prod|dev]"
  exit 1
fi

CHAIN_ID=$1
TAG=$2
SUBGRAPH_NAME=$NAME-$CHAIN_ID/$PACKAGE_VERSION
echo "Tagging subgraph $SUBGRAPH_NAME with $TAG"
goldsky subgraph tag delete $SUBGRAPH_NAME --tag $TAG
