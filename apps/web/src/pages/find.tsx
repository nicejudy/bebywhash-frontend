import { CHAIN_IDS, CHAIN_IDS_DEX } from 'utils/wagmi'
import PoolFinder from 'views/PoolFinder'

const PoolFinderPage = () => <PoolFinder />

PoolFinderPage.chains = CHAIN_IDS_DEX

export default PoolFinderPage
