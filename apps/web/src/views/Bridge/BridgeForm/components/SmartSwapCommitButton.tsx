import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { Button, Text, useModal, confirmPriceImpactWithoutFee, useToast } from '@pancakeswap/uikit'

import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Column from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Field } from 'state/swap/actions'
import ProgressSteps from 'views/Swap/components/ProgressSteps'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import useBurnToken from 'views/Bridge/hooks/useBurnToken'

interface SwapCommitButtonPropsType {
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<void>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  swapInputError: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  parsedAmount: CurrencyAmount<Currency>
  onUserInput: (field: Field, typedValue: string) => void
  pid: number
  isNative: boolean
}

export default function BridgeCommitButton({
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  currencies,
  swapInputError,
  currencyBalances,
  parsedAmount,
  onUserInput,
  pid,
  isNative
}: SwapCommitButtonPropsType) {
  const { t } = useTranslation()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()

  const { onStake } = useBurnToken(pid, isNative)

  // Handlers
  const handleSwap = async () => {
    const receipt = await fetchWithCatchTxError(() => onStake(parsedAmount.toFixed(0)))
    setApprovalSubmitted(false)

    if (receipt?.status) {
      toastSuccess(
        `${t('Bridged!')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been locked in the bridge pool. You will receive the funds in 1~2 minutes')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const isValid = !swapInputError
  const approved = approval === ApprovalState.APPROVED

  if (showApproveFlow) {
    return (
      <>
        <RowBetween>
          <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
            )}
          </CommitButton>
          <CommitButton
            variant='primary'
            onClick={handleSwap}
            width="48%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx}
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  {t('Bridging')} <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                t('Bridge')
            }
          </CommitButton>
        </RowBetween>
        <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column>
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant='primary'
        onClick={handleSwap}
        id="swap-button"
        width="100%"
        disabled={!isValid || !approved || pendingTx}
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              {t('Bridging')} <CircleLoader stroke="white" />
            </AutoRow>
          : 
          t('Bridge'))}
      </CommitButton>
    </>
  )
}
