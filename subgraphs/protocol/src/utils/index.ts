import { ethereum } from "@graphprotocol/graph-ts"

export const getEventId = (event: ethereum.Event): string => {
  return (
    event.transaction.hash.toHexString() +
    "-" +
    event.transactionLogIndex.toString()
  )
}
