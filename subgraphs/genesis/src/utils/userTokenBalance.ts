import { Address, BigInt } from "@graphprotocol/graph-ts"

import { UserTokenBalance } from "../../generated/schema"
import { putToken } from "./token/token"

export const putUserTokenBalance = (
  tokenAddress: Address,
  delta: BigInt,
  userAddress: Address
): UserTokenBalance => {
  const entity = UserTokenBalance.load(
    userAddress.toHexString().concat("-").concat(tokenAddress.toHexString())
  )

  if (entity === null) {
    const entity = new UserTokenBalance(
      userAddress.toHexString().concat("-").concat(tokenAddress.toHexString())
    )

    entity.token = putToken(tokenAddress).id
    entity.amount = delta
    entity.user = userAddress.toHexString()

    entity.save()
    return entity
  } else {
    entity.amount = entity.amount.plus(delta)
    entity.save()
    return entity
  }
}
