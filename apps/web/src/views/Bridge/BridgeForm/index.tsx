import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, NATIVE, Percent, ChainId, } from '@pancakeswap/sdk'
import {
  Box,
  Swap as SwapUI,
} from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useBridgeActionHandlers, useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { maxAmountSpend } from 'utils/maxAmountSpend'

import addresses from 'config/constants/contracts'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { useCurrency, useCurrencyBridge } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useBridgePool from 'hooks/useBridgePool'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useAtomValue } from 'jotai'
import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import CurrencyInputPanelForBridge from 'components/CurrencyInputPanel/bridge'
import { ArrowWrapper, Wrapper } from 'views/Swap/components/styleds'
import useRefreshBlockNumberID from 'views/Swap/hooks/useRefreshBlockNumber'
import useWarningImport from 'views/Bridge/hooks/useWarningImport'
import { useDerivedBridgeInfoWithStableSwap } from './hooks/useDerivedSwapInfoWithStableSwap'
import SmartSwapCommitButton from './components/SmartSwapCommitButton'
import CurrencyInputHeader from '../components/CurrencyInputHeader'
import { combinedTokenMapFromOfficialsUrlsAtom } from '../../../state/lists/hooks'

const getPID = (symbol?: string, chainId?: number) => {
  if (symbol === "ETH" || symbol === "cgETH") {
    return chainId === ChainId.ETHEREUM ? {pid: 0, isNative: true} : {pid: 0, isNative: false}
  }
  if (symbol === "WBTC" || symbol === "cgBTC") {
    return {pid: 1, isNative: false}
  }
  if (symbol === "USDT" || symbol === "cgUSD") {
    return {pid: 2, isNative: false}
  }
  return {pid: undefined, isNative: undefined}
}

export const BridgeForm: React.FC<Record<string, never>> = () => {
  const { t } = useTranslation()
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const warningSwapHandler = useWarningImport()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

  const { account, chainId } = useActiveWeb3React()

  const sourceChain = chainId === ChainId.ETHEREUM ? chainId : ChainId.SHIMMER2
  const targetChain = sourceChain === ChainId.ETHEREUM ? ChainId.SHIMMER2 : ChainId.ETHEREUM

  const { pendingChainId, canSwitch, switchNetworkAsync } = useSwitchNetwork()


  // swap state & price data

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrencyBridge(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  replaceBrowserHistory('token', inputCurrency?.symbol)

  const {pid, isNative} = getPID(inputCurrency?.symbol, sourceChain)

  const poolInfo = useBridgePool(pid)

  const {
    currencyBalances,
    parsedAmount,
    inputError: stableSwapInputError,
  } = useDerivedBridgeInfoWithStableSwap(independentField, typedValue, inputCurrency, outputCurrency, poolInfo?.min.toString(), poolInfo?.enabled)

  const { onCurrencySelection, onUserInput } = useBridgeActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
  }

  // const amountToApprove = parsedAmount
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(parsedAmount, addresses.bridge[sourceChain])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput?.symbol)

      // warningSwapHandler(newCurrencyInput)

      // const newCurrencyInputId = currencyId(newCurrencyInput)
      // if (newCurrencyInputId === outputCurrencyId) {
      //   replaceBrowserHistory('outputCurrency', inputCurrencyId)
      // }
      // replaceBrowserHistory('token', newCurrencyInput?.symbol)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])
  
  const fee = poolInfo?.fee ?? 30

  return (
    <>
      <CurrencyInputHeader
        title={t('Bridge')}
        subtitle={t('Trade tokens in an instant')}
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
        <AutoColumn gap="sm">
          <CurrencyInputPanelForBridge
            label={independentField === Field.OUTPUT && t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton
            maxAmount={maxAmountInput}
            showQuickInputButton
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            showBUSD={!!tokenMap[chainId]?.[inputCurrencyId] || inputCurrencyId === NATIVE[chainId]?.symbol}
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            chainId={sourceChain}
            isTargetChain={false}
          />

          <AutoColumn justify="space-between">
            <AutoRow justify='center' style={{ padding: '0 1rem' }}>
              <SwapUI.SwitchButton
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  switchNetworkAsync(targetChain);
                }}
              />
            </AutoRow>
          </AutoColumn>
          <CurrencyInputPanelForBridge
            label={independentField === Field.OUTPUT && t('From')}
            value={formattedAmounts[Field.INPUT] ? (Number(formattedAmounts[Field.INPUT]) * (10000-fee) / 10000).toString() : formattedAmounts[Field.INPUT]}
            showMaxButton={false}
            maxAmount={maxAmountInput}
            showQuickInputButton={false}
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            showBUSD={!!tokenMap[chainId]?.[inputCurrencyId] || inputCurrencyId === NATIVE[chainId]?.symbol}
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            chainId={targetChain}
            isTargetChain
          />
        </AutoColumn>

        <Box mt="0.25rem">
          <SmartSwapCommitButton
              account={account}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              setApprovalSubmitted={setApprovalSubmitted}
              currencies={currencies}
              swapInputError={stableSwapInputError}
              currencyBalances={currencyBalances}
              onUserInput={onUserInput}
              pid={pid}
              isNative={isNative}
              parsedAmount={parsedAmount}
            />
        </Box>
      </Wrapper>
    </>
  )
}
