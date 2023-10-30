import { Currency, CurrencyAmount, Pair, TradeType } from '@pancakeswap/sdk'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'

export function useDerivedBridgeInfoWithStableSwap(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  min: string | undefined,
  enabled: boolean | undefined,
): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
  min?: string
} {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const parsedAmount = tryParseAmount(typedValue, independentCurrency ?? undefined)

  // TODO add invariant make sure v2 trade has the same input & output amount as trade with stable swap

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!currencies[Field.INPUT]) {
    inputError = inputError ?? t('Select a token')
  }

  inputError = t('Unavailable')

  // compare input balance to max input based on version
  const [balanceIn] = [
    currencyBalances[Field.INPUT],
    // slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]
  // console.log(balanceIn.lessThan(parsedAmount?? 0))
  if (balanceIn && balanceIn.lessThan(parsedAmount?? 0)) {
    inputError = t('Insufficient %symbol% balance', { symbol: balanceIn.currency.symbol })
  }

  if (parsedAmount ? parsedAmount.lessThan(min ?? 0) : false) {
    inputError = t('No enough bridge fee')
  }

  if (!enabled) {
    inputError = t('Disabled token')
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
  }
}
