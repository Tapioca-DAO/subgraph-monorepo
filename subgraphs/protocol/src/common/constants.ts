import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts"

////////////////////////
///// Schema Enums /////
////////////////////////

export namespace Network {
  export const ARBITRUM_ONE = "ARBITRUM_ONE"
  export const AVALANCHE = "AVALANCHE"
  export const AURORA = "AURORA"
  export const BSC = "BSC" // aka BNB Chain
  export const CELO = "CELO"
  export const MAINNET = "MAINNET" // Ethereum mainnet
  export const FANTOM = "FANTOM"
  export const FUSE = "FUSE"
  export const MOONBEAM = "MOONBEAM"
  export const MOONRIVER = "MOONRIVER"
  export const NEAR_MAINNET = "NEAR_MAINNET"
  export const OPTIMISM = "OPTIMISM"
  export const MATIC = "MATIC" // aka Polygon
  export const XDAI = "XDAI" // aka Gnosis Chain

  export const ARBITRUM_GOERLI = "ARBITRUM_GOERLI"
  export const MUMBAI = "MUMBAI"
  export const FANTOM_TESTNET = "FANTOM_TESTNET"
  export const AVALANCHE_FUJI = "AVALANCHE_FUJI"
}

export namespace ProtocolType {
  export const EXCHANGE = "EXCHANGE"
  export const LENDING = "LENDING"
  export const YIELD = "YIELD"
  export const BRIDGE = "BRIDGE"
  export const GENERIC = "GENERIC"
  export const TAPIOCA = "TAPIOCA"
}

export namespace VaultFeeType {
  export const MANAGEMENT_FEE = "MANAGEMENT_FEE"
  export const PERFORMANCE_FEE = "PERFORMANCE_FEE"
  export const DEPOSIT_FEE = "DEPOSIT_FEE"
  export const WITHDRAWAL_FEE = "WITHDRAWAL_FEE"
}

export namespace LiquidityPoolFeeType {
  export const FIXED_TRADING_FEE = "FIXED_TRADING_FEE"
  export const TIERED_TRADING_FEE = "TIERED_TRADING_FEE"
  export const DYNAMIC_TRADING_FEE = "DYNAMIC_TRADING_FEE"
  export const PROTOCOL_FEE = "PROTOCOL_FEE"
}

export namespace RewardTokenType {
  export const DEPOSIT = "DEPOSIT"
  export const BORROW = "BORROW"
}

export namespace LendingType {
  export const CDP = "CDP"
  export const POOLED = "POOLED"
}

export namespace RiskType {
  export const GLOBAL = "GLOBAL"
  export const ISOLATED = "ISOLATED"
}

export namespace EventType {
  export const BORROW = "BORROW"
  export const DEPOSIT = "DEPOSIT"
  export const WITHDRAW = "WITHDRAW"
  export const REPAY = "REPAY"
  export const LIQUIDATEE = "LIQUIDATEE"
  export const LIQUIDATOR = "LIQUIDATOR"
}

export namespace PositionType {
  export const LEND_BORROW_ASSET = "LEND_BORROW_ASSET"
  export const BORROW = "BORROW"
  export const PROVIDE_COLLATERAL_ASSET = "PROVIDE_COLLATERAL_ASSET"
}

export namespace MarketType {
  export const SINGULARITY = "SINGULARITY"
  export const BIG_BANG = "BIG_BANG"
}

////////////////////////
///// Type Helpers /////
////////////////////////

export const DEFAULT_DECIMALS = 18

export const USDC_DECIMALS = 6
export const USDC_DENOMINATOR = BigDecimal.fromString("1000000")

export const BIGINT_ZERO = BigInt.fromI32(0)
export const BIGINT_ONE = BigInt.fromI32(1)
export const BIGINT_TWO = BigInt.fromI32(2)
export const BIGINT_THOUSAND = BigInt.fromI32(1000)
export const BIGINT_MAX = BigInt.fromString(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export const INT_ZERO = 0 as i32
export const INT_ONE = 1 as i32
export const INT_TWO = 2 as i32
export const NEG_INT_ONE = -1 as i32

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO)
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE)
export const BIGDECIMAL_TWO = new BigDecimal(BIGINT_TWO)
export const BIGDECIMAL_ONE_HUNDRED = new BigDecimal(BigInt.fromI32(100))

export const MAX_UINT = BigInt.fromI32(2).times(BigInt.fromI32(255))

/////////////////////
///// Date/Time /////
/////////////////////

export const SECONDS_PER_HOUR = 60 * 60 // 360
export const SECONDS_PER_DAY = 60 * 60 * 24 // 86400
export const SECONDS_PER_YEAR = new BigDecimal(
  BigInt.fromI32(60 * 60 * 24 * 365)
)
export const MS_PER_DAY = new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000))
export const DAYS_PER_YEAR = new BigDecimal(BigInt.fromI32(365))
export const MS_PER_YEAR = DAYS_PER_YEAR.times(
  new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000))
)

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
)

export namespace TokenType {
  export const Native = "NATIVE" // 0
  export const ERC20 = "ERC20" // 1
  export const ERC721 = "ERC721" // 2
  export const ERC1155 = "ERC1155" // 3
}
