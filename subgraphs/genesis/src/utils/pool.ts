import { Bytes } from "@graphprotocol/graph-ts"

import { Pool } from "../../generated/schema"

export const putPool = (rawPoolId: Bytes): string => {
  let pool = Pool.load(rawPoolId.toHexString())

  if (pool == null) {
    pool = new Pool(rawPoolId.toHexString())
    pool.save()
  }

  return rawPoolId.toHexString()
}
