import { CHAIN_IDS, CHAIN_IDS_DEX } from 'utils/wagmi'
import Swap from 'views/Swap'
import { SwapFeaturesProvider } from 'views/Swap/SwapFeaturesContext'

const SwapPage = () => {
  return (
    <SwapFeaturesProvider>
      <Swap />
    </SwapFeaturesProvider>
  )
}

SwapPage.chains = CHAIN_IDS_DEX

export default SwapPage
