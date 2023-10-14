import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'
import { USDC, USDT, WBTC_ETH, NEBULA_ETH, DAI_ETH, KNB, NEBULA, MATIC_KNB } from './common'

export const shimmerTokens = {
  weth: WETH9[ChainId.SHIMMER2],
  smr: new ERC20Token(
    ChainId.SHIMMER2,
    '0x1074010000000000000000000000000000000000',
    6,
    'SMR',
    'Shimmer',
    'https://shimmer.network/',
  ),
  cgt: new ERC20Token(
    ChainId.SHIMMER2,
    '0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6',
    18,
    'CGT',
    'CyberGlow Token',
    'https://cyberglow.es/',
  ),
  apein: new ERC20Token(
    ChainId.SHIMMER2,
    '0x264F2e6142CE8bEA68e5C646f8C07db98A9E003A',
    18,
    'APEin',
    'ApeDAO',
    'https://apedao.finance/',
  ),
  ihg: new ERC20Token(
    ChainId.SHIMMER2,
    '0x3bBb9B7848De06778fEE4fE0bC4d9AB271e56648',
    18,
    'IHG',
    'Gold',
    'https://cyberglow.es/',
  ),
  wen: new ERC20Token(
    ChainId.SHIMMER2,
    '0x4259b21ad6d95d747dda908e9617443a530cd20d',
    18,
    'WEN',
    'WEN Token',
    'https://cyberglow.es/',
  ),
  assmb: new ERC20Token(
    ChainId.SHIMMER2,
    '0x2F69dC2d27051493C775e4d36Be2bEBA5d7093E8',
    18,
    'ASSMB',
    'Assembly Meme Coin',
    'https://cyberglow.es/',
  ),
  fish: new ERC20Token(
    ChainId.SHIMMER2,
    '0xe051d1af4b1149FfB314C41C87E3501CFb961a73',
    18,
    'FISH',
    'BigFish',
    'https://cyberglow.es/',
  ),
}
