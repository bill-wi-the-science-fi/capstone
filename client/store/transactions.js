import axios from 'axios'
/* ACTION TYPES
 */
const GET_ALL_TRANSACTIONS = 'GET_ALL_TRANSACTIONS'
const POST_TRANSACTION = 'POST_TRANSACTION'
const CONVERT_USD_ETH = 'CONVERT_USD_ETH'
const NEW_TRANSACTION = 'NEW_TRANSACTION'
const CLEAR_TRANSACTION = 'CLEAR_TRANSACTION'

/**
 * ACTION CREATORS
 */

const _getAllTransactions = (transactions) => ({
  type: GET_ALL_TRANSACTIONS,
  transactions
})
const _postTransaction = (transaction) => ({
  type: POST_TRANSACTION,
  transaction
})
const _getpriceConversion = (amountETH) => ({
  type: CONVERT_USD_ETH,
  amountETH
})
export const newTransaction = (transaction) => ({
  type: NEW_TRANSACTION,
  transaction
})
export const clearTransaction = () => ({
  type: CLEAR_TRANSACTION
})

/**
 * THUNK CREATORS
 */

// export const getAllTransactions = () => async (dispatch) => {
//   try {

//   } catch (err) {
//     console.error(err)
//   }
// }
export const postTransaction = (txnData) => {
  return async (dispatch) => {
    try {
      const {
        userId,
        awardId,
        transactionHash,
        amountEther,
        smartContractAddress
      } = txnData
      let body = {
        userId,
        awardId,
        transactionHash,
        amountEther,
        smartContractAddress
      }
      const transaction = (await axios.post('/api/transactions', body)).data
      dispatch(_postTransaction(transaction))
    } catch (error) {
      console.log(error)
    }
  }
}
export const getPriceConversion = (amountUSD) => {
  return async (dispatch) => {
    try {
      amountUSD = amountUSD.toFixed(2)
      const ethPerUsd = (
        await axios.get(
          'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH'
        )
      ).data
      const amountETH = (ethPerUsd.ETH * amountUSD).toFixed(8)

      dispatch(_getpriceConversion(amountETH))
      return amountETH
    } catch (error) {
      console.log(error)
    }
  }
}
/**
 * INITIAL STATE
 */
const allTransactions = {
  previousTransaction: {},
  allTransactions: [],
  amountETH: 0,
  pendingTransaction: {}
}

/**
 * REDUCER
 */
export default function (state = allTransactions, action) {
  switch (action.type) {
    case POST_TRANSACTION:
      if (action.transaction) {
        return {...state, previousTransaction: action.transaction}
      } else {
        return state
      }
    case CONVERT_USD_ETH:
      return {...state, amountETH: action.amountETH}
    case NEW_TRANSACTION:
      return {...state, pendingTransaction: action.transaction}
    case CLEAR_TRANSACTION:
      return allTransactions
    default:
      return state
  }
}
