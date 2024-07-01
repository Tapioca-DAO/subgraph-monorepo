import assert from "assert"
import { ethers } from "ethers"
import _ from "lodash"

import { fetchTolpYbIds } from "./fetchTolpYbIds"
import { MarketBaseData, STORE, ToftDefinitions, TokenBaseData } from "./store"
import {
  Penrose__factory,
  Singularity__factory,
  TOFT__factory,
} from "./typechain"
import { getProvider } from "./utils/getProvider"
import { chainIdToLzChainId, lzChainIdToChainId } from "./utils/lzChainId"

const SGL_TOFT_FILLS = [
  {
    market: {
      chainId: 421614,
      address: "0x56F147211d835272B24020B41543B76011d61676",
    },
    address: ethers.ZeroAddress,
    chainId: 43113,
  },
]

export const storeFullySetupSglMarketsWithTofts = async (
  penroses: {
    chainId: number
    addresses: string[]
  }[],
  tsgls: {
    chainId: number
    addresses: string[]
  }[],
  tolps: {
    chainId: number
    addresses: string[]
  }[],
  supportedChains: number[],
) => {
  const mainChaindId = supportedChains[0]
  // sanity check
  if (penroses.some(({ addresses }) => addresses.length !== 1)) {
    throw new Error("Penroses with multiple addresses not supported")
  }

  const markets: { chainId: number; address: string }[] = []
  const tmarkets: {
    chainId: number
    address: string
    toft: {
      chainId: number
      address: string
    }
  }[] = []

  for (let i = 0; i < tsgls.length; i++) {
    const { addresses, chainId } = tsgls[i]
    const penroseAddress = penroses.find(({ chainId: c }) => c === chainId)
      ?.addresses[0]
    assert(penroseAddress, "Penrose address not found")

    const penroseContract = Penrose__factory.connect(
      penroseAddress,
      getProvider(chainId),
    )

    const sglMarkets = await penroseContract.singularityMarkets()

    sglMarkets.forEach((address) => {
      markets.push({
        chainId,
        address,
      })
    })

    for (let j = 0; j < addresses.length; j++) {
      const address = addresses[j]
      const contract = TOFT__factory.connect(address, getProvider(chainId))
      const cid = lzChainIdToChainId(Number(await contract.hostEid()))
      const sglAddress = await contract.erc20()

      tmarkets.push({
        chainId: cid,
        address: sglAddress,
        toft: {
          chainId,
          address,
        },
      })
    }
  }

  const finalMarkets: typeof tmarkets = []

  for (let i = 0; i < markets.length; i++) {
    const m = markets[i]

    const filteredTofts = tmarkets.filter(
      (tm) => tm.chainId === m.chainId && tm.address === m.address,
    )

    if (filteredTofts.length !== 2 && m.chainId !== mainChaindId) {
      const missingChains = supportedChains.filter(
        (c) => !filteredTofts.map((m) => m.toft.chainId).includes(c),
      )

      for (let j = 0; j < missingChains.length; j++) {
        const fillerToft = SGL_TOFT_FILLS.find(
          (f) =>
            f.market.chainId === m.chainId &&
            f.market.address === m.address &&
            f.chainId === missingChains[j],
        )
        if (fillerToft) {
          console.log(
            `Filling market ${m.address} on chain ${m.chainId} with toft ${fillerToft.address} on chain ${fillerToft.chainId}`,
          )
          filteredTofts.forEach((tm) => {
            finalMarkets.push(tm)
          })
        } else {
          console.warn(
            `Skipping market ${m.address} on chain ${m.chainId} as it has ${
              filteredTofts.length
            } tofts setup ${missingChains
              .map((c) => `on chain ${c}`)
              .join(", ")}`,
          )
        }
      }
    } else {
      filteredTofts.forEach((tm) => {
        finalMarkets.push(tm)
      })
    }
  }

  const groupedMarkets = _.groupBy(
    finalMarkets,
    (m) => `${m.chainId}-${m.address}`,
  )

  const outMarkets: {
    chainId: number
    address: string
    tofts: { chainId: number; address: string }[]
  }[] = []

  for (const toftMarkets of Object.values(groupedMarkets)) {
    outMarkets.push({
      chainId: toftMarkets[0].chainId,
      address: toftMarkets[0].address,
      tofts: toftMarkets.map((m) => m.toft),
    })
  }

  await storeMarketsAndTokensToStore(outMarkets, tolps)
}

const storeMarketsAndTokensToStore = async (
  outMarkets: {
    chainId: number
    address: string
    tofts: {
      chainId: number
      address: string
    }[]
  }[],
  tolps: {
    chainId: number
    addresses: string[]
  }[],
) => {
  const tolpYbIds = await fetchTolpYbIds(tolps)

  for (let i = 0; i < outMarkets.length; i++) {
    const market = outMarkets[i]

    for (let j = 0; j < market.tofts.length; j++) {
      const toft = market.tofts[j]
      STORE.toftAddresses[toft.chainId].add(toft.address)
    }

    STORE.tokenAddresses[market.chainId].add(market.address)

    const sglContract = Singularity__factory.connect(
      market.address,
      getProvider(market.chainId),
    )

    const oracleAddress = await sglContract._oracle()
    const collateralAddress = await sglContract._collateral()
    const borrowAddress = await sglContract._asset()

    STORE.toftAddresses[market.chainId].add(collateralAddress)
    STORE.toftAddresses[market.chainId].add(borrowAddress)
    STORE.tokenAddresses[market.chainId].add(
      await TOFT__factory.connect(
        collateralAddress,
        getProvider(market.chainId),
      ).erc20(),
    )

    const outM: MarketBaseData = {
      chainId: market.chainId,
      address: market.address,
      oracleAddress,
      type: "SGL",
      borrowToken: {
        address: borrowAddress,
        chainId: market.chainId,
      },
      collateralToken: {
        address: collateralAddress,
        chainId: market.chainId,
      },
    }

    const ybIdMetadata = tolpYbIds.find(
      (m) => m.marketAddress === market.address,
    )

    if (ybIdMetadata) {
      outM.tolpLockSglYbId = ybIdMetadata.tolpTsglYbId
      outM.tSglAddress = ybIdMetadata.tSglAddress
    }

    STORE.output.markets.singularityMarkets.push(outM)
  }
}

export const storeFullySetupBbMarketsWithTofts = async (
  penroses: {
    chainId: number
    addresses: string[]
  }[],
  supportedChains: number[],
) => {
  // sanity check
  if (penroses.some(({ addresses }) => addresses.length !== 1)) {
    throw new Error("Penroses with multiple addresses not supported")
  }

  for (let i = 0; i < penroses.length; i++) {
    const penroseAddress = penroses[i].addresses[0]
    const chainId = penroses[i].chainId

    assert(penroseAddress, "Penrose address not found")

    const penroseContract = Penrose__factory.connect(
      penroseAddress,
      getProvider(chainId),
    )

    const bbMarkets = await penroseContract.bigBangMarkets()

    for (let j = 0; j < bbMarkets.length; j++) {
      const marketAddress = bbMarkets[j]

      const marketContract = Singularity__factory.connect(
        marketAddress,
        getProvider(chainId),
      )

      const collateralAddress = await marketContract._collateral()
      const borrowAddress = await marketContract._asset()

      STORE.toftAddresses[chainId].add(collateralAddress)
      STORE.toftAddresses[chainId].add(borrowAddress)
      STORE.tokenAddresses[chainId].add(
        await TOFT__factory.connect(
          collateralAddress,
          getProvider(chainId),
        ).erc20(),
      )

      const oracleAddress = await marketContract._oracle()

      STORE.output.markets.bigBangMarkets.push({
        chainId: chainId,
        address: marketAddress,
        oracleAddress,
        type: "BB",
        borrowToken: {
          address: borrowAddress,
          chainId: chainId,
        },
        collateralToken: {
          address: collateralAddress,
          chainId: chainId,
        },
      })
    }
  }
}

const parseToken = async (
  address: string,
  chainId: number,
): Promise<TokenBaseData> => {
  const contract = TOFT__factory.connect(address, getProvider(chainId))

  const [name, symbol, decimals, supportsEip2612] = await Promise.allSettled([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.nonces(ethers.ZeroAddress),
  ])

  return {
    chainId,
    address,
    name: name.status === "fulfilled" ? name.value : "",
    symbol: symbol.status === "fulfilled" ? symbol.value : "",
    decimals: Number(decimals.status === "fulfilled" ? decimals.value : 0),
    supportsEip2612: supportsEip2612.status === "fulfilled",
  }
}

export const parseTokens = async (supportedChains: number[]) => {
  for (let i = 0; i < supportedChains.length; i++) {
    const chainId = supportedChains[i]
    const tokens = Array.from(STORE.tokenAddresses[chainId])
    for (let j = 0; j < tokens.length; j++) {
      const address = tokens[j]
      const token = await parseToken(address, chainId)
      STORE.output.tokens.push(token)
    }
  }
}

const parseToft = async (
  address: string,
  chainId: number,
  supportedChains: number[],
): Promise<TokenBaseData> => {
  const mainChaindId = supportedChains[0]
  console.log("parsing toft", address, chainId)
  const contract = TOFT__factory.connect(address, getProvider(chainId))

  const token = await parseToken(address, chainId)
  let toftDefinitions: ToftDefinitions = {
    remotes: [],
  }

  let chainIdFromHostEid = chainId
  try {
    const hostEid = await contract.hostEid()
    chainIdFromHostEid = lzChainIdToChainId(Number(hostEid))
    // USDO won't have this
  } catch {
    // do nothing
  }

  if (chainIdFromHostEid === chainId) {
    try {
      const erc20 = await contract.erc20()
      toftDefinitions = {
        underlying: {
          chainId,
          address: erc20,
        },
        remotes: [],
      }
      // USDO won't have this
    } catch {
      // do nothing
    }
  }

  for (let i = 0; i < supportedChains.length; i++) {
    const supChain = supportedChains[i]

    if (supChain === chainId) {
      toftDefinitions.remotes.push({
        chainId: chainId,
        address: address,
      })
    }

    const peer = await contract.peers(chainIdToLzChainId(supChain))
    const peerAddress = "0x" + peer.slice(-40)
    if (peerAddress !== ethers.ZeroAddress) {
      toftDefinitions.remotes.push({
        chainId: supChain,
        address: ethers.getAddress(peerAddress),
      })
    }
  }

  const allchainSymbols = ["USDO", "TAP"]
  // sanity check
  if (allchainSymbols.includes(token.symbol)) {
    if (toftDefinitions.remotes.length !== supportedChains.length) {
      console.log(
        `TOFT remotes length mismatch for token ${token.symbol} - ${address} on chain ${chainId}. Printing remotes:`,
      )
      console.log(toftDefinitions.remotes)
    }
  } else if (
    token.symbol.startsWith("T_SGL") &&
    (!toftDefinitions.underlying ||
      toftDefinitions.underlying.chainId !== mainChaindId)
  ) {
    if (toftDefinitions.remotes.length !== 2) {
      console.log(
        `TOFT remotes length mismatch for token ${token.symbol} - ${address} on chain ${chainId}. Printing remotes:`,
      )
      console.log(toftDefinitions.remotes)
    }
  } else if (toftDefinitions.remotes.length !== 1) {
    console.log(
      `TOFT remotes length mismatch for token ${token.symbol} - ${address} on chain ${chainId}. Printing remotes:`,
    )
    console.log(toftDefinitions.remotes)
  }

  return {
    ...token,
    toftDefinitions,
  }
}

export const parseTofts = async (supportedChains: number[]) => {
  let remotes: ToftDefinitions["remotes"] = []

  for (let i = 0; i < supportedChains.length; i++) {
    const chainId = supportedChains[i]
    const tokens = Array.from(STORE.toftAddresses[chainId])

    for (let j = 0; j < tokens.length; j++) {
      const address = tokens[j]
      const token = await parseToft(address, chainId, supportedChains)
      remotes = remotes.concat(token.toftDefinitions!.remotes)
      STORE.output.tokens.push(token)
    }

    remotes = Array.from(new Set(remotes))
  }

  for (let i = 0; i < remotes.length; i++) {
    const remote = remotes[i]
    const toft = STORE.toftAddresses[remote.chainId].has(remote.address)
    if (!toft) {
      const token = await parseToft(
        remote.address,
        remote.chainId,
        supportedChains,
      )

      STORE.output.tokens.push(token)
    }
  }
}

export const deduplicateTokens = () => {
  const tokens = STORE.output.tokens
  const deduplicatedTokens: TokenBaseData[] = []
  const deduplicatedTokensByAddressChainId: {
    [address: string]: TokenBaseData
  } = {}

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const addressChainId = `${token.address}-${token.chainId}`
    if (deduplicatedTokensByAddressChainId[addressChainId]) {
      continue
    }
    deduplicatedTokensByAddressChainId[addressChainId] = token
    deduplicatedTokens.push(token)
  }

  STORE.output.tokens = deduplicatedTokens
}

const NATIVE_TOKENS = [
  { chainId: 43113, decimals: 18, symbol: "AVAX", name: "Avalanche Fuji" },
  { chainId: 5, decimals: 18, symbol: "ETH", name: "Goerli Ether" },
  { chainId: 11155111, decimals: 18, symbol: "ETH", name: "Sepolia Ether" },
  {
    chainId: 421613,
    decimals: 18,
    symbol: "ETH",
    name: "Arbitrum Goerli Ether",
  },
  {
    chainId: 421614,
    decimals: 18,
    symbol: "ETH",
    name: "Arbitrum Sepolia Ether",
  },
  {
    chainId: 11155420,
    decimals: 18,
    symbol: "ETH",
    name: "Optimism Sepolia Ether",
  },
  { chainId: 80001, decimals: 18, symbol: "MATIC", name: "MATIC" },
  { chainId: 4002, decimals: 18, symbol: "FTM", name: "Fantom" },
  // mainnet
  { chainId: 1, decimals: 18, symbol: "ETH", name: "Ether" },
  {
    chainId: 42161,
    decimals: 18,
    symbol: "ETH",
    name: "Arbitrum Sepolia Ether",
  },
]

export const addNativeTokens = (supportedChains: number[]) => {
  for (let i = 0; i < supportedChains.length; i++) {
    const supChain = supportedChains[i]

    const token = NATIVE_TOKENS.find((t) => t.chainId === supChain)

    assert(token, `Native token not found ${supChain}`)

    STORE.output.tokens.push({
      ...token,
      address: ethers.ZeroAddress,
    })
  }
}

export const addTapToStore = (
  tofts: {
    chainId: number
    addresses: string[]
  }[],
  supportedChains: number[],
) => {
  for (let i = 0; i < tofts.length; i++) {
    assert(
      tofts[i].addresses.length === 1,
      "Only one address supported as TAP per chain",
    )
    const toft = tofts[i]
    STORE.toftAddresses[toft.chainId].add(toft.addresses[0])
  }
}

export const crosscheckTofts = () => {
  const tokens = STORE.output.tokens

  for (let i = 0; i < tokens.length; i++) {
    const toft = tokens[i]
    if (!toft.toftDefinitions || toft.toftDefinitions.remotes.length === 0) {
      continue
    }

    for (let j = 0; j < toft.toftDefinitions.remotes.length; j++) {
      const remote = toft.toftDefinitions.remotes[j]

      if (remote.chainId === toft.chainId) {
        continue
      }

      const remoteToken = tokens.find(
        (t) => t.chainId === remote.chainId && t.address === remote.address,
      )

      assert(
        remoteToken,
        `Remote token not found ${remote.chainId} ${remote.address}`,
      )
      assert(
        remoteToken.toftDefinitions,
        `Remote token ${remote.chainId} ${remote.address} has no toft definitions`,
      )
      assert(
        remoteToken.toftDefinitions.remotes.length,
        `Remote token ${remote.chainId} ${remote.address} has no remotes`,
      )

      const found = toft.toftDefinitions.remotes
        .map((x) => `${x.address}-${x.chainId}`)
        .every((r) =>
          remoteToken
            .toftDefinitions!.remotes.map((x) => `${x.address}-${x.chainId}`)
            .includes(r),
        )

      if (!found) {
        console.log(
          `Remote token ${remote.chainId} ${remote.address} has remotes`,
        )
        console.log(remoteToken.toftDefinitions.remotes)
        console.log(`but toft ${toft.chainId} ${toft.address} has`)
        console.log(toft.toftDefinitions.remotes)
        console.log("--------------------")
      }
    }
  }
}
