import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | KronoSwap',
  defaultTitle: 'KronoSwap',
  description:
    'Cheaper and faster than Uniswap? Discover KronoSwap, the leading DEX on Kronobit & Polygon with the best farms in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@KronoSwapInfo',
    site: '@KronoSwapInfo',
  },
  openGraph: {
    title: 'KronoSwap - A next evolution DeFi exchange on Kronobit & Polygon',
    description:
      'The most popular AMM on Kronobit & Polygon! Earn XKR through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://kronoswap.finance/images/knb.png' }],
  },
}
