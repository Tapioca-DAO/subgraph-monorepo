import { TOLP__factory } from "./typechain"
import { getProvider } from "./utils/getProvider"

export const playground = async () => {
  const tolp = TOLP__factory.connect(
    "0x9b47f96F13c557A4015c1aa670522A3586Ae0dc5",
    getProvider(421614),
  )

  for (let i = 0; i < 30; i++) {
    tolp.sglAssetIDToAddress(i).then((address) => {
      console.log(`${i}: ${address}`)
    })
  }
}
