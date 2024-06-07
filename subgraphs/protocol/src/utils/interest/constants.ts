import { BigDecimal, BigInt } from "@graphprotocol/graph-ts"

export const BIG_INT_ZERO = BigInt.fromI32(0)
export const BIG_DECIMAL_ZERO = BigDecimal.fromString("0")
export const BIG_DECIMAL_ONE = BigDecimal.fromString("1")
export const BIG_INT_ONE = BigInt.fromI32(1)

export const HOUR_IN_SECONDS = 3600
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS

// MEDIUM RISK PAIR CONFIGURATION
// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L79
export const MINIMUM_TARGET_UTILIZATION = BigInt.fromI32(7).times(
  BigInt.fromI32(10).pow(17),
) // 70%
// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L80
export const MAXIMUM_TARGET_UTILIZATION = BigInt.fromI32(8).times(
  BigInt.fromI32(10).pow(17),
) // 80%
// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L81
export const UTILIZATION_PRECISION = BigInt.fromI32(10).pow(18)
// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L82
export const FULL_UTILIZATION = BigInt.fromI32(10).pow(18)
// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L83
export const FULL_UTILIZATION_MINUS_MAX = FULL_UTILIZATION.minus(
  MAXIMUM_TARGET_UTILIZATION,
)

// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L89
export const INTEREST_ELASTICITY = BigInt.fromString(
  "28800000000000000000000000000000000000000",
) // Half or double in 28800 seconds (8 hours) if linear

export const FACTOR_PRECISION = BigInt.fromString("1000000000000000000")

class KashiActions {
  PAIR_ADD_COLLATERAL: string
  PAIR_REMOVE_COLLATERAL: string
  PAIR_ADD_ASSET: string
  PAIR_REMOVE_ASSET: string
  PAIR_BORROW: string
  PAIR_REPAY: string
}

export const ACTIONS: KashiActions = {
  PAIR_ADD_COLLATERAL: "addCollateral",
  PAIR_REMOVE_COLLATERAL: "removeCollateral",
  PAIR_ADD_ASSET: "addAsset",
  PAIR_REMOVE_ASSET: "removeAsset",
  PAIR_BORROW: "borrow",
  PAIR_REPAY: "repay",
}

// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L86
export const STARTING_INTEREST_PER_YEAR = BigInt.fromI32(317097920)
  .times(BigInt.fromI32(60))
  .times(BigInt.fromI32(60))
  .times(BigInt.fromI32(24))
  .times(BigInt.fromI32(365)) // approx 1% APR
// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L87
export const MINIMUM_INTEREST_PER_YEAR = BigInt.fromI32(79274480)
  .times(BigInt.fromI32(60))
  .times(BigInt.fromI32(60))
  .times(BigInt.fromI32(24))
  .times(BigInt.fromI32(365)) // approx 0.25% APR

// https://github.com/Tapioca-DAO/YieldBox/blob/dba08de54cf50d8e8c479dcc4441dd49b2905080/contracts/samples/lending/Lending.sol#L88
export const MAXIMUM_INTEREST_PER_YEAR = STARTING_INTEREST_PER_YEAR.times(
  BigInt.fromI32(1000),
)
