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

export class AMLDivergence extends ethereum.Event {
  get params(): AMLDivergence__Params {
    return new AMLDivergence__Params(this);
  }
}

export class AMLDivergence__Params {
  _event: AMLDivergence;

  constructor(event: AMLDivergence) {
    this._event = event;
  }

  get epoch(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get cumulative(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get averageMagnitude(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get totalParticipants(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class ExerciseOption extends ethereum.Event {
  get params(): ExerciseOption__Params {
    return new ExerciseOption__Params(this);
  }
}

export class ExerciseOption__Params {
  _event: ExerciseOption;

  constructor(event: ExerciseOption) {
    this._event = event;
  }

  get epoch(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get paymentToken(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get otapTokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get tapAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class ExitPosition extends ethereum.Event {
  get params(): ExitPosition__Params {
    return new ExitPosition__Params(this);
  }
}

export class ExitPosition__Params {
  _event: ExitPosition;

  constructor(event: ExitPosition) {
    this._event = event;
  }

  get epoch(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get otapTokenId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get tolpTokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NewEpoch extends ethereum.Event {
  get params(): NewEpoch__Params {
    return new NewEpoch__Params(this);
  }
}

export class NewEpoch__Params {
  _event: NewEpoch;

  constructor(event: NewEpoch) {
    this._event = event;
  }

  get epoch(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get extractedTap(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get epochTapValuation(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

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

export class Participate extends ethereum.Event {
  get params(): Participate__Params {
    return new Participate__Params(this);
  }
}

export class Participate__Params {
  _event: Participate;

  constructor(event: Participate) {
    this._event = event;
  }

  get epoch(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get sglAssetId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get totalDeposited(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get otapTokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get tolpTokenId(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get discount(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class PearlmitUpdated extends ethereum.Event {
  get params(): PearlmitUpdated__Params {
    return new PearlmitUpdated__Params(this);
  }
}

export class PearlmitUpdated__Params {
  _event: PearlmitUpdated;

  constructor(event: PearlmitUpdated) {
    this._event = event;
  }

  get oldPearlmit(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newPearlmit(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class SetPaymentToken extends ethereum.Event {
  get params(): SetPaymentToken__Params {
    return new SetPaymentToken__Params(this);
  }
}

export class SetPaymentToken__Params {
  _event: SetPaymentToken;

  constructor(event: SetPaymentToken) {
    this._event = event;
  }

  get paymentToken(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get oracle(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get oracleData(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }
}

export class SetTapOracle extends ethereum.Event {
  get params(): SetTapOracle__Params {
    return new SetTapOracle__Params(this);
  }
}

export class SetTapOracle__Params {
  _event: SetTapOracle;

  constructor(event: SetTapOracle) {
    this._event = event;
  }

  get oracle(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get oracleData(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TOB__getOTCDealDetailsResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getEligibleTapAmount(): BigInt {
    return this.value0;
  }

  getPaymentTokenAmount(): BigInt {
    return this.value1;
  }

  getTapAmount(): BigInt {
    return this.value2;
  }
}

export class TOB__participantsResult {
  value0: boolean;
  value1: boolean;
  value2: BigInt;

  constructor(value0: boolean, value1: boolean, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromBoolean(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getHasVotingPower(): boolean {
    return this.value0;
  }

  getDivergenceForce(): boolean {
    return this.value1;
  }

  getAverageMagnitude(): BigInt {
    return this.value2;
  }
}

export class TOB__paymentTokensResult {
  value0: Address;
  value1: Bytes;

  constructor(value0: Address, value1: Bytes) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromBytes(this.value1));
    return map;
  }

  getOracle(): Address {
    return this.value0;
  }

  getOracleData(): Bytes {
    return this.value1;
  }
}

export class TOB__twAMLResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }

  getTotalParticipants(): BigInt {
    return this.value0;
  }

  getAverageMagnitude(): BigInt {
    return this.value1;
  }

  getTotalDeposited(): BigInt {
    return this.value2;
  }

  getCumulative(): BigInt {
    return this.value3;
  }
}

export class TOB extends ethereum.SmartContract {
  static bind(address: Address): TOB {
    return new TOB("TOB", address);
  }

  EPOCH_DURATION(): BigInt {
    let result = super.call("EPOCH_DURATION", "EPOCH_DURATION():(uint256)", []);

    return result[0].toBigInt();
  }

  try_EPOCH_DURATION(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "EPOCH_DURATION",
      "EPOCH_DURATION():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  MIN_WEIGHT_FACTOR(): BigInt {
    let result = super.call(
      "MIN_WEIGHT_FACTOR",
      "MIN_WEIGHT_FACTOR():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_MIN_WEIGHT_FACTOR(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "MIN_WEIGHT_FACTOR",
      "MIN_WEIGHT_FACTOR():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  emissionsStartTime(): BigInt {
    let result = super.call(
      "emissionsStartTime",
      "emissionsStartTime():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_emissionsStartTime(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "emissionsStartTime",
      "emissionsStartTime():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  epoch(): BigInt {
    let result = super.call("epoch", "epoch():(uint256)", []);

    return result[0].toBigInt();
  }

  try_epoch(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("epoch", "epoch():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  epochTAPValuation(): BigInt {
    let result = super.call(
      "epochTAPValuation",
      "epochTAPValuation():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_epochTAPValuation(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "epochTAPValuation",
      "epochTAPValuation():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCurrentWeek(): BigInt {
    let result = super.call("getCurrentWeek", "getCurrentWeek():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getCurrentWeek(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCurrentWeek",
      "getCurrentWeek():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getOTCDealDetails(
    _oTAPTokenID: BigInt,
    _paymentToken: Address,
    _tapAmount: BigInt
  ): TOB__getOTCDealDetailsResult {
    let result = super.call(
      "getOTCDealDetails",
      "getOTCDealDetails(uint256,address,uint256):(uint256,uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_oTAPTokenID),
        ethereum.Value.fromAddress(_paymentToken),
        ethereum.Value.fromUnsignedBigInt(_tapAmount)
      ]
    );

    return new TOB__getOTCDealDetailsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_getOTCDealDetails(
    _oTAPTokenID: BigInt,
    _paymentToken: Address,
    _tapAmount: BigInt
  ): ethereum.CallResult<TOB__getOTCDealDetailsResult> {
    let result = super.tryCall(
      "getOTCDealDetails",
      "getOTCDealDetails(uint256,address,uint256):(uint256,uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_oTAPTokenID),
        ethereum.Value.fromAddress(_paymentToken),
        ethereum.Value.fromUnsignedBigInt(_tapAmount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TOB__getOTCDealDetailsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  netDepositedForEpoch(epoch: BigInt, sglAssetID: BigInt): BigInt {
    let result = super.call(
      "netDepositedForEpoch",
      "netDepositedForEpoch(uint256,uint256):(int256)",
      [
        ethereum.Value.fromUnsignedBigInt(epoch),
        ethereum.Value.fromUnsignedBigInt(sglAssetID)
      ]
    );

    return result[0].toBigInt();
  }

  try_netDepositedForEpoch(
    epoch: BigInt,
    sglAssetID: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "netDepositedForEpoch",
      "netDepositedForEpoch(uint256,uint256):(int256)",
      [
        ethereum.Value.fromUnsignedBigInt(epoch),
        ethereum.Value.fromUnsignedBigInt(sglAssetID)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  oTAP(): Address {
    let result = super.call("oTAP", "oTAP():(address)", []);

    return result[0].toAddress();
  }

  try_oTAP(): ethereum.CallResult<Address> {
    let result = super.tryCall("oTAP", "oTAP():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  oTAPCalls(param0: BigInt, param1: BigInt): BigInt {
    let result = super.call(
      "oTAPCalls",
      "oTAPCalls(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_oTAPCalls(param0: BigInt, param1: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "oTAPCalls",
      "oTAPCalls(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  onERC721Received(
    operator: Address,
    from: Address,
    tokenId: BigInt,
    data: Bytes
  ): Bytes {
    let result = super.call(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromBytes(data)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC721Received(
    operator: Address,
    from: Address,
    tokenId: BigInt,
    data: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromBytes(data)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
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

  participants(param0: BigInt): TOB__participantsResult {
    let result = super.call(
      "participants",
      "participants(uint256):(bool,bool,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new TOB__participantsResult(
      result[0].toBoolean(),
      result[1].toBoolean(),
      result[2].toBigInt()
    );
  }

  try_participants(
    param0: BigInt
  ): ethereum.CallResult<TOB__participantsResult> {
    let result = super.tryCall(
      "participants",
      "participants(uint256):(bool,bool,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TOB__participantsResult(
        value[0].toBoolean(),
        value[1].toBoolean(),
        value[2].toBigInt()
      )
    );
  }

  participate(_tOLPTokenID: BigInt): BigInt {
    let result = super.call("participate", "participate(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(_tOLPTokenID)
    ]);

    return result[0].toBigInt();
  }

  try_participate(_tOLPTokenID: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "participate",
      "participate(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_tOLPTokenID)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  paymentTokenBeneficiary(): Address {
    let result = super.call(
      "paymentTokenBeneficiary",
      "paymentTokenBeneficiary():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_paymentTokenBeneficiary(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "paymentTokenBeneficiary",
      "paymentTokenBeneficiary():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paymentTokens(param0: Address): TOB__paymentTokensResult {
    let result = super.call(
      "paymentTokens",
      "paymentTokens(address):(address,bytes)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new TOB__paymentTokensResult(
      result[0].toAddress(),
      result[1].toBytes()
    );
  }

  try_paymentTokens(
    param0: Address
  ): ethereum.CallResult<TOB__paymentTokensResult> {
    let result = super.tryCall(
      "paymentTokens",
      "paymentTokens(address):(address,bytes)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TOB__paymentTokensResult(value[0].toAddress(), value[1].toBytes())
    );
  }

  pearlmit(): Address {
    let result = super.call("pearlmit", "pearlmit():(address)", []);

    return result[0].toAddress();
  }

  try_pearlmit(): ethereum.CallResult<Address> {
    let result = super.tryCall("pearlmit", "pearlmit():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  singularityGauges(param0: BigInt, param1: BigInt): BigInt {
    let result = super.call(
      "singularityGauges",
      "singularityGauges(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_singularityGauges(
    param0: BigInt,
    param1: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "singularityGauges",
      "singularityGauges(uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  tOLP(): Address {
    let result = super.call("tOLP", "tOLP():(address)", []);

    return result[0].toAddress();
  }

  try_tOLP(): ethereum.CallResult<Address> {
    let result = super.tryCall("tOLP", "tOLP():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  tapOFT(): Address {
    let result = super.call("tapOFT", "tapOFT():(address)", []);

    return result[0].toAddress();
  }

  try_tapOFT(): ethereum.CallResult<Address> {
    let result = super.tryCall("tapOFT", "tapOFT():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  tapOracle(): Address {
    let result = super.call("tapOracle", "tapOracle():(address)", []);

    return result[0].toAddress();
  }

  try_tapOracle(): ethereum.CallResult<Address> {
    let result = super.tryCall("tapOracle", "tapOracle():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  tapOracleData(): Bytes {
    let result = super.call("tapOracleData", "tapOracleData():(bytes)", []);

    return result[0].toBytes();
  }

  try_tapOracleData(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("tapOracleData", "tapOracleData():(bytes)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  timestampToWeek(timestamp: BigInt): BigInt {
    let result = super.call(
      "timestampToWeek",
      "timestampToWeek(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(timestamp)]
    );

    return result[0].toBigInt();
  }

  try_timestampToWeek(timestamp: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "timestampToWeek",
      "timestampToWeek(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(timestamp)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  twAML(param0: BigInt): TOB__twAMLResult {
    let result = super.call(
      "twAML",
      "twAML(uint256):(uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new TOB__twAMLResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_twAML(param0: BigInt): ethereum.CallResult<TOB__twAMLResult> {
    let result = super.tryCall(
      "twAML",
      "twAML(uint256):(uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TOB__twAMLResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
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

  get _tOLP(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _oTAP(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tapOFT(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _paymentTokenBeneficiary(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _epochDuration(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _pearlmit(): Address {
    return this._call.inputValues[5].value.toAddress();
  }

  get _owner(): Address {
    return this._call.inputValues[6].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CollectPaymentTokensCall extends ethereum.Call {
  get inputs(): CollectPaymentTokensCall__Inputs {
    return new CollectPaymentTokensCall__Inputs(this);
  }

  get outputs(): CollectPaymentTokensCall__Outputs {
    return new CollectPaymentTokensCall__Outputs(this);
  }
}

export class CollectPaymentTokensCall__Inputs {
  _call: CollectPaymentTokensCall;

  constructor(call: CollectPaymentTokensCall) {
    this._call = call;
  }

  get _paymentTokens(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class CollectPaymentTokensCall__Outputs {
  _call: CollectPaymentTokensCall;

  constructor(call: CollectPaymentTokensCall) {
    this._call = call;
  }
}

export class ExerciseOptionCall extends ethereum.Call {
  get inputs(): ExerciseOptionCall__Inputs {
    return new ExerciseOptionCall__Inputs(this);
  }

  get outputs(): ExerciseOptionCall__Outputs {
    return new ExerciseOptionCall__Outputs(this);
  }
}

export class ExerciseOptionCall__Inputs {
  _call: ExerciseOptionCall;

  constructor(call: ExerciseOptionCall) {
    this._call = call;
  }

  get _oTAPTokenID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _paymentToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tapAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ExerciseOptionCall__Outputs {
  _call: ExerciseOptionCall;

  constructor(call: ExerciseOptionCall) {
    this._call = call;
  }
}

export class ExitPositionCall extends ethereum.Call {
  get inputs(): ExitPositionCall__Inputs {
    return new ExitPositionCall__Inputs(this);
  }

  get outputs(): ExitPositionCall__Outputs {
    return new ExitPositionCall__Outputs(this);
  }
}

export class ExitPositionCall__Inputs {
  _call: ExitPositionCall;

  constructor(call: ExitPositionCall) {
    this._call = call;
  }

  get _oTAPTokenID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ExitPositionCall__Outputs {
  _call: ExitPositionCall;

  constructor(call: ExitPositionCall) {
    this._call = call;
  }
}

export class InitCall extends ethereum.Call {
  get inputs(): InitCall__Inputs {
    return new InitCall__Inputs(this);
  }

  get outputs(): InitCall__Outputs {
    return new InitCall__Outputs(this);
  }
}

export class InitCall__Inputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class InitCall__Outputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class NewEpochCall extends ethereum.Call {
  get inputs(): NewEpochCall__Inputs {
    return new NewEpochCall__Inputs(this);
  }

  get outputs(): NewEpochCall__Outputs {
    return new NewEpochCall__Outputs(this);
  }
}

export class NewEpochCall__Inputs {
  _call: NewEpochCall;

  constructor(call: NewEpochCall) {
    this._call = call;
  }
}

export class NewEpochCall__Outputs {
  _call: NewEpochCall;

  constructor(call: NewEpochCall) {
    this._call = call;
  }
}

export class OnERC721ReceivedCall extends ethereum.Call {
  get inputs(): OnERC721ReceivedCall__Inputs {
    return new OnERC721ReceivedCall__Inputs(this);
  }

  get outputs(): OnERC721ReceivedCall__Outputs {
    return new OnERC721ReceivedCall__Outputs(this);
  }
}

export class OnERC721ReceivedCall__Inputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get from(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OnERC721ReceivedCall__Outputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class ParticipateCall extends ethereum.Call {
  get inputs(): ParticipateCall__Inputs {
    return new ParticipateCall__Inputs(this);
  }

  get outputs(): ParticipateCall__Outputs {
    return new ParticipateCall__Outputs(this);
  }
}

export class ParticipateCall__Inputs {
  _call: ParticipateCall;

  constructor(call: ParticipateCall) {
    this._call = call;
  }

  get _tOLPTokenID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ParticipateCall__Outputs {
  _call: ParticipateCall;

  constructor(call: ParticipateCall) {
    this._call = call;
  }

  get oTAPTokenID(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
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

export class SetMinWeightFactorCall extends ethereum.Call {
  get inputs(): SetMinWeightFactorCall__Inputs {
    return new SetMinWeightFactorCall__Inputs(this);
  }

  get outputs(): SetMinWeightFactorCall__Outputs {
    return new SetMinWeightFactorCall__Outputs(this);
  }
}

export class SetMinWeightFactorCall__Inputs {
  _call: SetMinWeightFactorCall;

  constructor(call: SetMinWeightFactorCall) {
    this._call = call;
  }

  get _minWeightFactor(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetMinWeightFactorCall__Outputs {
  _call: SetMinWeightFactorCall;

  constructor(call: SetMinWeightFactorCall) {
    this._call = call;
  }
}

export class SetPauseCall extends ethereum.Call {
  get inputs(): SetPauseCall__Inputs {
    return new SetPauseCall__Inputs(this);
  }

  get outputs(): SetPauseCall__Outputs {
    return new SetPauseCall__Outputs(this);
  }
}

export class SetPauseCall__Inputs {
  _call: SetPauseCall;

  constructor(call: SetPauseCall) {
    this._call = call;
  }

  get _pauseState(): boolean {
    return this._call.inputValues[0].value.toBoolean();
  }
}

export class SetPauseCall__Outputs {
  _call: SetPauseCall;

  constructor(call: SetPauseCall) {
    this._call = call;
  }
}

export class SetPaymentTokenCall extends ethereum.Call {
  get inputs(): SetPaymentTokenCall__Inputs {
    return new SetPaymentTokenCall__Inputs(this);
  }

  get outputs(): SetPaymentTokenCall__Outputs {
    return new SetPaymentTokenCall__Outputs(this);
  }
}

export class SetPaymentTokenCall__Inputs {
  _call: SetPaymentTokenCall;

  constructor(call: SetPaymentTokenCall) {
    this._call = call;
  }

  get _paymentToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _oracle(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _oracleData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class SetPaymentTokenCall__Outputs {
  _call: SetPaymentTokenCall;

  constructor(call: SetPaymentTokenCall) {
    this._call = call;
  }
}

export class SetPaymentTokenBeneficiaryCall extends ethereum.Call {
  get inputs(): SetPaymentTokenBeneficiaryCall__Inputs {
    return new SetPaymentTokenBeneficiaryCall__Inputs(this);
  }

  get outputs(): SetPaymentTokenBeneficiaryCall__Outputs {
    return new SetPaymentTokenBeneficiaryCall__Outputs(this);
  }
}

export class SetPaymentTokenBeneficiaryCall__Inputs {
  _call: SetPaymentTokenBeneficiaryCall;

  constructor(call: SetPaymentTokenBeneficiaryCall) {
    this._call = call;
  }

  get _paymentTokenBeneficiary(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPaymentTokenBeneficiaryCall__Outputs {
  _call: SetPaymentTokenBeneficiaryCall;

  constructor(call: SetPaymentTokenBeneficiaryCall) {
    this._call = call;
  }
}

export class SetPearlmitCall extends ethereum.Call {
  get inputs(): SetPearlmitCall__Inputs {
    return new SetPearlmitCall__Inputs(this);
  }

  get outputs(): SetPearlmitCall__Outputs {
    return new SetPearlmitCall__Outputs(this);
  }
}

export class SetPearlmitCall__Inputs {
  _call: SetPearlmitCall;

  constructor(call: SetPearlmitCall) {
    this._call = call;
  }

  get _pearlmit(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPearlmitCall__Outputs {
  _call: SetPearlmitCall;

  constructor(call: SetPearlmitCall) {
    this._call = call;
  }
}

export class SetTapOracleCall extends ethereum.Call {
  get inputs(): SetTapOracleCall__Inputs {
    return new SetTapOracleCall__Inputs(this);
  }

  get outputs(): SetTapOracleCall__Outputs {
    return new SetTapOracleCall__Outputs(this);
  }
}

export class SetTapOracleCall__Inputs {
  _call: SetTapOracleCall;

  constructor(call: SetTapOracleCall) {
    this._call = call;
  }

  get _tapOracle(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tapOracleData(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class SetTapOracleCall__Outputs {
  _call: SetTapOracleCall;

  constructor(call: SetTapOracleCall) {
    this._call = call;
  }
}

export class SetVirtualTotalAmountCall extends ethereum.Call {
  get inputs(): SetVirtualTotalAmountCall__Inputs {
    return new SetVirtualTotalAmountCall__Inputs(this);
  }

  get outputs(): SetVirtualTotalAmountCall__Outputs {
    return new SetVirtualTotalAmountCall__Outputs(this);
  }
}

export class SetVirtualTotalAmountCall__Inputs {
  _call: SetVirtualTotalAmountCall;

  constructor(call: SetVirtualTotalAmountCall) {
    this._call = call;
  }

  get _virtualTotalAmount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetVirtualTotalAmountCall__Outputs {
  _call: SetVirtualTotalAmountCall;

  constructor(call: SetVirtualTotalAmountCall) {
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
