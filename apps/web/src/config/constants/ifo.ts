import { ERC20Token, ChainId, NATIVE, Native } from '@pancakeswap/sdk'
import { bscTokens, ethereumTokens, shimmerTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './lp'
import { Ifo } from './types'

export const cakeBnbLpToken = new ERC20Token(ChainId.BSC, CAKE_BNB_LP_MAINNET, 18, 'CAKE-BNB LP')

const ifos: Ifo[] = [
  {
    id: 'cyberglow',
    address: '0x849Cb2aC8d7E344E88770931bc168Eb4b252Cf8C',
    isActive: true,
    name: 'CGT',
    plannedStartTime: 1698152400, // Oct 27 2023 15:00:00 UTC
    poolBasic: {
      raiseAmount: '10,000,000 SMR',
    },
    poolUnlimited: {
      raiseAmount: '30,000,000 SMR',
    },
    currency: shimmerTokens.smr,
    token: shimmerTokens.test,
    campaignId: '0',
    articleUrl:
      '/',
    tokenOfferingPrice: 0.8,
    version: 2,
    twitterUrl: 'https://twitter.com/Cyberglow_cgt',
    description:
      'CyberGlow is a decentralized exchange that provides cryptocurrency users with a secure, efficient and fully decentralized platform for exchanging digital assets. With a focus on transparency, security, and accessibility, our DEX is designed to give users absolute control over their assets and operations.',
    vestingTitle: 'Use $CGT to enjoy premium features(exchange, farming, staking, game, etc) on CyberGlow Decentralized Exchange',
  }
]

export default ifos
