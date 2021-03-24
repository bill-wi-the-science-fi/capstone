import axios from 'axios'
/* ACTION TYPES
 */
const GET_ALL_TRANSACTIONS = 'GET_ALL_TRANSACTIONS'
const POST_TRANSACTION = 'POST_TRANSACTION'

/**
 * INITIAL STATE
 */
const allTransactions = {}

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
      let txnHash = transactionHash
        ? transactionHash
        : '0x05cbd37d856b8a5fb78799c023c132d8feace6d319e1c7d5391bb36fce86a59f'
      let scAddress = smartContractAddress
        ? smartContractAddress
        : '0x3afae04805bb556ff14a4af4aa7875053d6c3948'
      let body = {userId, awardId, txnHash, amountEther, scAddress}
      const transaction = (await axios.post('/api/transactions', body)).data
      // be consistent with initial state (check what axios returns)
      dispatch(_postTransaction(transaction))
    } catch (error) {
      console.log(error)
    }
  }
}
/**
 * REDUCER
 */
export default function (state = allTransactions, action) {
  switch (action.type) {
    case POST_TRANSACTION:
      return action.transactions
    default:
      return state
  }
}
