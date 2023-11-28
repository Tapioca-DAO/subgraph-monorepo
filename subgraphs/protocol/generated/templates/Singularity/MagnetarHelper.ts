// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class MagnetarHelper__bigBangMarketInfoResultValue0Struct extends ethereum.Tuple {
  get market(): MagnetarHelper__bigBangMarketInfoResultValue0MarketStruct {
    return changetype<
      MagnetarHelper__bigBangMarketInfoResultValue0MarketStruct
    >(this[0].toTuple());
  }

  get accrueInfo(): MagnetarHelper__bigBangMarketInfoResultValue0AccrueInfoStruct {
    return changetype<
      MagnetarHelper__bigBangMarketInfoResultValue0AccrueInfoStruct
    >(this[1].toTuple());
  }

  get minDebtRate(): BigInt {
    return this[2].toBigInt();
  }

  get maxDebtRate(): BigInt {
    return this[3].toBigInt();
  }

  get debtRateAgainstEthMarket(): BigInt {
    return this[4].toBigInt();
  }

  get mainBBMarket(): Address {
    return this[5].toAddress();
  }

  get mainBBDebtRate(): BigInt {
    return this[6].toBigInt();
  }

  get currentDebtRate(): BigInt {
    return this[7].toBigInt();
  }
}

export class MagnetarHelper__bigBangMarketInfoResultValue0MarketStruct extends ethereum.Tuple {
  get collateral(): Address {
    return this[0].toAddress();
  }

  get collateralId(): BigInt {
    return this[1].toBigInt();
  }

  get asset(): Address {
    return this[2].toAddress();
  }

  get assetId(): BigInt {
    return this[3].toBigInt();
  }

  get oracle(): Address {
    return this[4].toAddress();
  }

  get oracleData(): Bytes {
    return this[5].toBytes();
  }

  get totalCollateralShare(): BigInt {
    return this[6].toBigInt();
  }

  get userCollateralShare(): BigInt {
    return this[7].toBigInt();
  }

  get totalBorrow(): MagnetarHelper__bigBangMarketInfoResultValue0MarketTotalBorrowStruct {
    return changetype<
      MagnetarHelper__bigBangMarketInfoResultValue0MarketTotalBorrowStruct
    >(this[8].toTuple());
  }

  get userBorrowPart(): BigInt {
    return this[9].toBigInt();
  }

  get currentExchangeRate(): BigInt {
    return this[10].toBigInt();
  }

  get spotExchangeRate(): BigInt {
    return this[11].toBigInt();
  }

  get oracleExchangeRate(): BigInt {
    return this[12].toBigInt();
  }

  get totalBorrowCap(): BigInt {
    return this[13].toBigInt();
  }

  get totalYieldBoxCollateralShare(): BigInt {
    return this[14].toBigInt();
  }

  get totalYieldBoxCollateralAmount(): BigInt {
    return this[15].toBigInt();
  }

  get totalYieldBoxAssetShare(): BigInt {
    return this[16].toBigInt();
  }

  get totalYieldBoxAssetAmount(): BigInt {
    return this[17].toBigInt();
  }

  get yieldBoxCollateralTokenType(): i32 {
    return this[18].toI32();
  }

  get yieldBoxCollateralContractAddress(): Address {
    return this[19].toAddress();
  }

  get yieldBoxCollateralStrategyAddress(): Address {
    return this[20].toAddress();
  }

  get yieldBoxCollateralTokenId(): BigInt {
    return this[21].toBigInt();
  }

  get yieldBoxAssetTokenType(): i32 {
    return this[22].toI32();
  }

  get yieldBoxAssetContractAddress(): Address {
    return this[23].toAddress();
  }

  get yieldBoxAssetStrategyAddress(): Address {
    return this[24].toAddress();
  }

  get yieldBoxAssetTokenId(): BigInt {
    return this[25].toBigInt();
  }

  get collateralizationRate(): BigInt {
    return this[26].toBigInt();
  }
}

export class MagnetarHelper__bigBangMarketInfoResultValue0MarketTotalBorrowStruct extends ethereum.Tuple {
  get elastic(): BigInt {
    return this[0].toBigInt();
  }

  get base(): BigInt {
    return this[1].toBigInt();
  }
}

export class MagnetarHelper__bigBangMarketInfoResultValue0AccrueInfoStruct extends ethereum.Tuple {
  get debtRate(): BigInt {
    return this[0].toBigInt();
  }

  get lastAccrued(): BigInt {
    return this[1].toBigInt();
  }
}

export class MagnetarHelper__singularityMarketInfoResultValue0Struct extends ethereum.Tuple {
  get market(): MagnetarHelper__singularityMarketInfoResultValue0MarketStruct {
    return changetype<
      MagnetarHelper__singularityMarketInfoResultValue0MarketStruct
    >(this[0].toTuple());
  }

  get totalAsset(): MagnetarHelper__singularityMarketInfoResultValue0TotalAssetStruct {
    return changetype<
      MagnetarHelper__singularityMarketInfoResultValue0TotalAssetStruct
    >(this[1].toTuple());
  }

  get userAssetFraction(): BigInt {
    return this[2].toBigInt();
  }

  get accrueInfo(): MagnetarHelper__singularityMarketInfoResultValue0AccrueInfoStruct {
    return changetype<
      MagnetarHelper__singularityMarketInfoResultValue0AccrueInfoStruct
    >(this[3].toTuple());
  }

  get utilization(): BigInt {
    return this[4].toBigInt();
  }

  get minimumTargetUtilization(): BigInt {
    return this[5].toBigInt();
  }

  get maximumTargetUtilization(): BigInt {
    return this[6].toBigInt();
  }

  get minimumInterestPerSecond(): BigInt {
    return this[7].toBigInt();
  }

  get maximumInterestPerSecond(): BigInt {
    return this[8].toBigInt();
  }

  get interestElasticity(): BigInt {
    return this[9].toBigInt();
  }

  get startingInterestPerSecond(): BigInt {
    return this[10].toBigInt();
  }
}

export class MagnetarHelper__singularityMarketInfoResultValue0MarketStruct extends ethereum.Tuple {
  get collateral(): Address {
    return this[0].toAddress();
  }

  get collateralId(): BigInt {
    return this[1].toBigInt();
  }

  get asset(): Address {
    return this[2].toAddress();
  }

  get assetId(): BigInt {
    return this[3].toBigInt();
  }

  get oracle(): Address {
    return this[4].toAddress();
  }

  get oracleData(): Bytes {
    return this[5].toBytes();
  }

  get totalCollateralShare(): BigInt {
    return this[6].toBigInt();
  }

  get userCollateralShare(): BigInt {
    return this[7].toBigInt();
  }

  get totalBorrow(): MagnetarHelper__singularityMarketInfoResultValue0MarketTotalBorrowStruct {
    return changetype<
      MagnetarHelper__singularityMarketInfoResultValue0MarketTotalBorrowStruct
    >(this[8].toTuple());
  }

  get userBorrowPart(): BigInt {
    return this[9].toBigInt();
  }

  get currentExchangeRate(): BigInt {
    return this[10].toBigInt();
  }

  get spotExchangeRate(): BigInt {
    return this[11].toBigInt();
  }

  get oracleExchangeRate(): BigInt {
    return this[12].toBigInt();
  }

  get totalBorrowCap(): BigInt {
    return this[13].toBigInt();
  }

  get totalYieldBoxCollateralShare(): BigInt {
    return this[14].toBigInt();
  }

  get totalYieldBoxCollateralAmount(): BigInt {
    return this[15].toBigInt();
  }

  get totalYieldBoxAssetShare(): BigInt {
    return this[16].toBigInt();
  }

  get totalYieldBoxAssetAmount(): BigInt {
    return this[17].toBigInt();
  }

  get yieldBoxCollateralTokenType(): i32 {
    return this[18].toI32();
  }

  get yieldBoxCollateralContractAddress(): Address {
    return this[19].toAddress();
  }

  get yieldBoxCollateralStrategyAddress(): Address {
    return this[20].toAddress();
  }

  get yieldBoxCollateralTokenId(): BigInt {
    return this[21].toBigInt();
  }

  get yieldBoxAssetTokenType(): i32 {
    return this[22].toI32();
  }

  get yieldBoxAssetContractAddress(): Address {
    return this[23].toAddress();
  }

  get yieldBoxAssetStrategyAddress(): Address {
    return this[24].toAddress();
  }

  get yieldBoxAssetTokenId(): BigInt {
    return this[25].toBigInt();
  }

  get collateralizationRate(): BigInt {
    return this[26].toBigInt();
  }
}

export class MagnetarHelper__singularityMarketInfoResultValue0MarketTotalBorrowStruct extends ethereum.Tuple {
  get elastic(): BigInt {
    return this[0].toBigInt();
  }

  get base(): BigInt {
    return this[1].toBigInt();
  }
}

export class MagnetarHelper__singularityMarketInfoResultValue0TotalAssetStruct extends ethereum.Tuple {
  get elastic(): BigInt {
    return this[0].toBigInt();
  }

  get base(): BigInt {
    return this[1].toBigInt();
  }
}

export class MagnetarHelper__singularityMarketInfoResultValue0AccrueInfoStruct extends ethereum.Tuple {
  get interestPerSecond(): BigInt {
    return this[0].toBigInt();
  }

  get lastAccrued(): BigInt {
    return this[1].toBigInt();
  }

  get feesEarnedFraction(): BigInt {
    return this[2].toBigInt();
  }
}

export class MagnetarHelper extends ethereum.SmartContract {
  static bind(address: Address): MagnetarHelper {
    return new MagnetarHelper("MagnetarHelper", address);
  }

  bigBangMarketInfo(
    who: Address,
    markets: Array<Address>
  ): Array<MagnetarHelper__bigBangMarketInfoResultValue0Struct> {
    let result = super.call(
      "bigBangMarketInfo",
      "bigBangMarketInfo(address,address[]):(((address,uint256,address,uint256,address,bytes,uint256,uint256,(uint128,uint128),uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,address,address,uint256,uint8,address,address,uint256,uint256),(uint64,uint64),uint256,uint256,uint256,address,uint256,uint256)[])",
      [
        ethereum.Value.fromAddress(who),
        ethereum.Value.fromAddressArray(markets)
      ]
    );

    return result[0].toTupleArray<
      MagnetarHelper__bigBangMarketInfoResultValue0Struct
    >();
  }

  try_bigBangMarketInfo(
    who: Address,
    markets: Array<Address>
  ): ethereum.CallResult<
    Array<MagnetarHelper__bigBangMarketInfoResultValue0Struct>
  > {
    let result = super.tryCall(
      "bigBangMarketInfo",
      "bigBangMarketInfo(address,address[]):(((address,uint256,address,uint256,address,bytes,uint256,uint256,(uint128,uint128),uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,address,address,uint256,uint8,address,address,uint256,uint256),(uint64,uint64),uint256,uint256,uint256,address,uint256,uint256)[])",
      [
        ethereum.Value.fromAddress(who),
        ethereum.Value.fromAddressArray(markets)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<
        MagnetarHelper__bigBangMarketInfoResultValue0Struct
      >()
    );
  }

  getAmountForAssetFraction(singularity: Address, fraction: BigInt): BigInt {
    let result = super.call(
      "getAmountForAssetFraction",
      "getAmountForAssetFraction(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(singularity),
        ethereum.Value.fromUnsignedBigInt(fraction)
      ]
    );

    return result[0].toBigInt();
  }

  try_getAmountForAssetFraction(
    singularity: Address,
    fraction: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getAmountForAssetFraction",
      "getAmountForAssetFraction(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(singularity),
        ethereum.Value.fromUnsignedBigInt(fraction)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getAmountForBorrowPart(market: Address, borrowPart: BigInt): BigInt {
    let result = super.call(
      "getAmountForBorrowPart",
      "getAmountForBorrowPart(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(borrowPart)
      ]
    );

    return result[0].toBigInt();
  }

  try_getAmountForBorrowPart(
    market: Address,
    borrowPart: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getAmountForBorrowPart",
      "getAmountForBorrowPart(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(borrowPart)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getBorrowPartForAmount(market: Address, amount: BigInt): BigInt {
    let result = super.call(
      "getBorrowPartForAmount",
      "getBorrowPartForAmount(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBigInt();
  }

  try_getBorrowPartForAmount(
    market: Address,
    amount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getBorrowPartForAmount",
      "getBorrowPartForAmount(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCollateralAmountForShare(market: Address, share: BigInt): BigInt {
    let result = super.call(
      "getCollateralAmountForShare",
      "getCollateralAmountForShare(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(share)
      ]
    );

    return result[0].toBigInt();
  }

  try_getCollateralAmountForShare(
    market: Address,
    share: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCollateralAmountForShare",
      "getCollateralAmountForShare(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(share)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCollateralSharesForBorrowPart(
    market: Address,
    borrowPart: BigInt,
    collateralizationRatePrecision: BigInt,
    exchangeRatePrecision: BigInt
  ): BigInt {
    let result = super.call(
      "getCollateralSharesForBorrowPart",
      "getCollateralSharesForBorrowPart(address,uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(borrowPart),
        ethereum.Value.fromUnsignedBigInt(collateralizationRatePrecision),
        ethereum.Value.fromUnsignedBigInt(exchangeRatePrecision)
      ]
    );

    return result[0].toBigInt();
  }

  try_getCollateralSharesForBorrowPart(
    market: Address,
    borrowPart: BigInt,
    collateralizationRatePrecision: BigInt,
    exchangeRatePrecision: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCollateralSharesForBorrowPart",
      "getCollateralSharesForBorrowPart(address,uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(market),
        ethereum.Value.fromUnsignedBigInt(borrowPart),
        ethereum.Value.fromUnsignedBigInt(collateralizationRatePrecision),
        ethereum.Value.fromUnsignedBigInt(exchangeRatePrecision)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getFractionForAmount(singularity: Address, amount: BigInt): BigInt {
    let result = super.call(
      "getFractionForAmount",
      "getFractionForAmount(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(singularity),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBigInt();
  }

  try_getFractionForAmount(
    singularity: Address,
    amount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getFractionForAmount",
      "getFractionForAmount(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(singularity),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  singularityMarketInfo(
    who: Address,
    markets: Array<Address>
  ): Array<MagnetarHelper__singularityMarketInfoResultValue0Struct> {
    let result = super.call(
      "singularityMarketInfo",
      "singularityMarketInfo(address,address[]):(((address,uint256,address,uint256,address,bytes,uint256,uint256,(uint128,uint128),uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,address,address,uint256,uint8,address,address,uint256,uint256),(uint128,uint128),uint256,(uint64,uint64,uint128),uint256,uint256,uint256,uint256,uint256,uint256,uint256)[])",
      [
        ethereum.Value.fromAddress(who),
        ethereum.Value.fromAddressArray(markets)
      ]
    );

    return result[0].toTupleArray<
      MagnetarHelper__singularityMarketInfoResultValue0Struct
    >();
  }

  try_singularityMarketInfo(
    who: Address,
    markets: Array<Address>
  ): ethereum.CallResult<
    Array<MagnetarHelper__singularityMarketInfoResultValue0Struct>
  > {
    let result = super.tryCall(
      "singularityMarketInfo",
      "singularityMarketInfo(address,address[]):(((address,uint256,address,uint256,address,bytes,uint256,uint256,(uint128,uint128),uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint8,address,address,uint256,uint8,address,address,uint256,uint256),(uint128,uint128),uint256,(uint64,uint64,uint128),uint256,uint256,uint256,uint256,uint256,uint256,uint256)[])",
      [
        ethereum.Value.fromAddress(who),
        ethereum.Value.fromAddressArray(markets)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<
        MagnetarHelper__singularityMarketInfoResultValue0Struct
      >()
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}