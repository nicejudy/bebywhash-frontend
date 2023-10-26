import { CHAIN_IDS, CHAIN_IDS_DEX } from 'utils/wagmi'
import Liquidity from 'views/Pool'

const LiquidityPage = () => <Liquidity />

LiquidityPage.chains = CHAIN_IDS_DEX

export default LiquidityPage
