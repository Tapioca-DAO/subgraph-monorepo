import {
  Address,
  BigInt as GPBigInt,
  Bytes,
  ethereum,
} from "@graphprotocol/graph-ts"

// https://github.com/LayerZero-Labs/LayerZero/blob/main/contracts/UltraLightNodeV2.sol#L159
export class DeflatedPacket {
  _packetPayload: string

  constructor(packetPayload: Bytes) {
    this._packetPayload = packetPayload.toHexString()
  }

  get nonce(): GPBigInt {
    return ethereum
      .decode(
        "uint64",
        Bytes.fromHexString(
          "0x" + this._packetPayload.substring(2, 18).padStart(64, "0"),
        ),
      )!
      .toBigInt()
  }

  get srcChainId(): i32 {
    return ethereum
      .decode(
        "uint16",
        Bytes.fromHexString(
          "0x" + this._packetPayload.substring(18, 22).padStart(64, "0"),
        ),
      )!
      .toI32()
  }

  get srcAddress(): Address {
    return ethereum
      .decode(
        "address",
        Bytes.fromHexString(
          "0x" + this._packetPayload.substring(22, 62).padStart(64, "0"),
        ),
      )!
      .toAddress()
  }

  get dstChainId(): i32 {
    return ethereum
      .decode(
        "uint16",
        Bytes.fromHexString(
          "0x" + this._packetPayload.substring(62, 66).padStart(64, "0"),
        ),
      )!
      .toI32()
  }

  get dstAddress(): Address {
    return ethereum
      .decode(
        "address",
        Bytes.fromHexString(
          "0x" + this._packetPayload.substring(66, 106).padStart(64, "0"),
        ),
      )!
      .toAddress()
  }

  get payload(): Bytes {
    return Bytes.fromHexString("0x" + this._packetPayload.substring(106))
  }
}
