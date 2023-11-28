import { Address, Bytes } from "@graphprotocol/graph-ts"

import { YieldBox } from "../../generated/schema"
import { StaticContractDefinition } from "../constants/addresses"

class YieldBoxManagerImpl {
  ybAddress: Address
  ybAddressString: string

  constructor() {
    this.ybAddress = StaticContractDefinition.currentChain("yieldbox")
    this.ybAddressString = this.ybAddress.toHexString()
  }

  /**
   * updates or creates entity
   * @returns created or updated YieldBox entity
   */
  put(): YieldBox {
    let ybEntity = YieldBox.load(this.ybAddressString)

    if (ybEntity === null) {
      ybEntity = new YieldBox(this.ybAddressString)
      ybEntity.assetTotals = []
    }

    ybEntity.yieldBoxAddress = Bytes.fromHexString(this.ybAddressString)

    return ybEntity
  }

  /**
   * fetches entity
   * @returns returns YieldBox entity
   * @throws if entity does not exist
   */
  get(): YieldBox {
    const yb = YieldBox.load(this.ybAddressString)

    if (yb === null) {
      throw new Error("YieldBox entity does not exist")
    }

    return yb as YieldBox
  }

  /**
   * fetches or creates entity
   * @returns returns loaded or created YieldBox entity
   */
  getOrCreate(): YieldBox {
    const ybEntity = YieldBox.load(this.ybAddressString)

    if (ybEntity === null) {
      return this.put()
    } else {
      return ybEntity
    }
  }
}

export const YieldBoxManager = new YieldBoxManagerImpl()
