import { shimmerTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'CGT',
    lpAddress: '0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6',
    quoteToken: shimmerTokens.cgusd,
    token: shimmerTokens.cgt,
    isTokenOnly: true
  },
  {
    pid: 1,
    lpSymbol: 'SMR-CGT LP',
    lpAddress: '0x772d1a419174974eda13a63a5b64c4512dfb0b49',
    quoteToken: shimmerTokens.weth,
    token: shimmerTokens.cgt,
  },
  {
    pid: 2,
    lpSymbol: 'CGT-cgETH LP',
    lpAddress: '0x079a68f636986785bd4af005a57afc1030b00a8e',
    quoteToken: shimmerTokens.cgeth,
    token: shimmerTokens.cgt,
  },
  {
    pid: 3,
    lpSymbol: 'CGT-cgBTC LP',
    lpAddress: '0xe6da544bae05cade9600f91739221bbbed18c2f0',
    quoteToken: shimmerTokens.cgbtc,
    token: shimmerTokens.cgt,
  },
  {
    pid: 4,
    lpSymbol: 'CGT-cgUSD LP',
    lpAddress: '0xd1085a622aea5e1064819494b900e5d4cf8b38e3',
    quoteToken: shimmerTokens.cgusd,
    token: shimmerTokens.cgt,
  },
  {
    pid: 5,
    lpSymbol: 'SMR-cgETH LP',
    lpAddress: '0x2907cf7190069f530b900faefc7be4ee423e7b2a',
    quoteToken: shimmerTokens.weth,
    token: shimmerTokens.cgeth,
  },
  {
    pid: 6,
    lpSymbol: 'SMR-cgBTC LP',
    lpAddress: '0x0046a80687b84e75602a1567df7a18bccbaf6c4f',
    quoteToken: shimmerTokens.weth,
    token: shimmerTokens.cgbtc,
  },
  {
    pid: 7,
    lpSymbol: 'SMR-cgUSD LP',
    lpAddress: '0xbf565f40dcfc080c7e2e1afa8478cffa38e37ec1',
    quoteToken: shimmerTokens.weth,
    token: shimmerTokens.cgusd,
  },
  {
    pid: 8,
    lpSymbol: 'cgETH-cgBTC LP',
    lpAddress: '0x373d78536a93e65453ba0f39640d951ac3ac688a',
    quoteToken: shimmerTokens.cgbtc,
    token: shimmerTokens.cgeth,
  },
  {
    pid: 9,
    lpSymbol: 'cgETH-cgUSD LP',
    lpAddress: '0xb189da9701f5f8b8bb77a42a08f41468a262b752',
    quoteToken: shimmerTokens.cgeth,
    token: shimmerTokens.cgusd,
  },
  {
    pid: 10,
    lpSymbol: 'cgBTC-cgUSD LP',
    lpAddress: '0xdc206a5e72485bb8e3484b78a1cef441d4cea24b',
    quoteToken: shimmerTokens.cgbtc,
    token: shimmerTokens.cgusd,
  },
  // {
  //   pid: 7,
  //   lpSymbol: 'ETH-USDC LP',
  //   lpAddress: '0x357DbDb8F654BC8Dff53D1f258997BCDa596F5D8',
  //   quoteToken: ethereumTokens.weth,
  //   token: ethereumTokens.usdc,
  // },
  // {
  //   pid: 8,
  //   lpSymbol: 'ETH-USDT LP',
  //   lpAddress: '0x4dEA2772d2336C24A7a58Bb6D700A0bc96933c61',
  //   quoteToken: ethereumTokens.weth,
  //   token: ethereumTokens.usdt,
  // },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
