// LayerZero ID is a unique identifier for a transaction across all chains.
// It consists of the source address, source chain ID, nonce, destination address, destinationChain ID.
// Ref.: https://github.com/LayerZero-Labs/LayerZero/blob/48c21c3921931798184367fc02d3a8132b041942/contracts/NonceContract.sol#L10
import { BigInt as GPBigInt, Bytes } from "@graphprotocol/graph-ts"

export function lzId(
  sourceChainId: number,
  sourceAddress: string,
  destinationChainId: number,
  destinationAddress: string,
  nonce: GPBigInt,
): Bytes {
  return Bytes.fromI32(sourceChainId as i32)
    .concat(Bytes.fromHexString(sourceAddress))
    .concatI32(destinationChainId as i32)
    .concat(Bytes.fromHexString(destinationAddress))
    .concat(Bytes.fromHexString(Bytes.fromBigInt(nonce).toHexString()))
}
