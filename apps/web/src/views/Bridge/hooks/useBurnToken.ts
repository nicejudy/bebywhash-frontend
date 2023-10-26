import { useCallback } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { burn, burnETH } from 'utils/calls'
import { useBridge, useMasterchef, useNonBscVault } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { DEFAULT_GAS_LIMIT, ETH_GAS_LIMIT } from 'config'


const useBurnToken = (pid: number, isNative = false) => {
  const { chainId } = useActiveWeb3React()
  const gasLimit = chainId === ChainId.ETHEREUM ? ETH_GAS_LIMIT : DEFAULT_GAS_LIMIT
  const gasPrice = useGasPrice()
  const bridgeContract = useBridge()

  const handleStake = useCallback(
    async (amount: string) => {
      if (isNative) {
        return burnETH(bridgeContract, pid, amount, gasPrice, gasLimit)  
      }
      return burn(bridgeContract, pid, amount, gasPrice, gasLimit)
    },
    [bridgeContract, pid, gasPrice, isNative],
  )

  return { onStake: handleStake }
}

export default useBurnToken
