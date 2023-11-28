import { Bytes } from "@graphprotocol/graph-ts"

import { Count } from "../../generated/schema"

const ID = Bytes.fromI32(0 as i32)

export function add(type: string): void {
  let count = Count.load(ID)
  if (count == null) {
    count = new Count(ID)
    count.sends = 0
    count.receives = 0
    count.potentialNonBlockingLzApps = 0
  }

  if (type == "receive") {
    count.receives = count.receives + 1
  }

  if (type == "send") {
    count.sends = count.sends + 1
  }

  if (type == "potentialNonBlockingLzApp") {
    count.potentialNonBlockingLzApps = count.potentialNonBlockingLzApps + 1
  }

  count.save()
}
