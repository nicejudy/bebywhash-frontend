import { useCallback, useEffect, useMemo, useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'

import { useRouter } from 'next/router'

import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'

import { useCurrency, useAllTokens, useCurrencyBridge } from 'hooks/Tokens'
import { useDefaultsFromURLSearchBridge } from 'state/swap/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { isAddress } from 'utils'

export default function useWarningImport() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearchBridge()
  const { chainId, isWrongNetwork } = useActiveWeb3React()
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)

  const [loadedCurrency] = [
    useCurrencyBridge(loadedUrlParams?.inputCurrencyId),
  ]

  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedCurrency]?.filter((c): c is Token => c?.isToken) ?? [],
    [loadedCurrency],
  )

  const defaultTokens = useAllTokens()

  const importTokensNotInDefault =
    !isWrongNetwork && urlLoadedTokens
      ? urlLoadedTokens.filter((token: Token) => {
          const checksummedAddress = isAddress(token.address) || ''

          return !(checksummedAddress in defaultTokens || token.address === "0x144F6D1945DC54a8198D4a54D4b346a2170126c6") && token.chainId === chainId
        })
      : []

  const swapWarningHandler = useCallback((currencyInput) => {
    const showSwapWarning = shouldShowSwapWarning(currencyInput)
    if (showSwapWarning) {
      setSwapWarningCurrency(currencyInput)
    } else {
      setSwapWarningCurrency(null)
    }
  }, [])

  return swapWarningHandler
}
