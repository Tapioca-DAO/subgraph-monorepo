import { Account } from "../../../generated/schema"

export function getOrCreateAccount(accountId: string): Account {
  let account = Account.load(accountId)
  if (!account) {
    account = new Account(accountId)
    account.positionCount = 0
    account.openPositionCount = 0
    account.closedPositionCount = 0
    account.depositCount = 0
    account.withdrawCount = 0
    account.borrowCount = 0
    account.repayCount = 0
    account.teleportReceivedCount = 0
    account.save()
  }
  return account
}
