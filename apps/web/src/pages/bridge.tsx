import { CHAIN_IDS, CHAIN_IDS_BRIDGE } from 'utils/wagmi'
import Bridge from '../views/Bridge'
import { SwapFeaturesProvider } from '../views/Swap/SwapFeaturesContext'

const BridgePage = () => {
  return (
    // <SwapFeaturesProvider>
      <Bridge />
    // </SwapFeaturesProvider>
  )
}

BridgePage.chains = CHAIN_IDS_BRIDGE

export default BridgePage

// import { NotFound } from '@pancakeswap/uikit'

// const NotFoundPage = () => <NotFound />

// NotFoundPage.chains = []

// export default NotFoundPage