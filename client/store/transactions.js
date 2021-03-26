import axios from 'axios'
/* ACTION TYPES
 */
const GET_ALL_TRANSACTIONS = 'GET_ALL_TRANSACTIONS'
const POST_TRANSACTION = 'POST_TRANSACTION'
const NEW_TRANSACTION = 'NEW_TRANSACTION'

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
export const newTransaction = (transaction) => ({
  type: NEW_TRANSACTION,
  transaction
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

/**
 * INITIAL STATE
 */
const allTransactions = {
  previousTransaction: {},
  allTransactions: [],
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
    case NEW_TRANSACTION:
      return {...state, pendingTransaction: action.transaction}
    default:
      return state
  }
}
