import getWeb3 from '../common/getWeb3'
import Nominate from '../../build/contracts/Nominate.json'

// action type
const SET_WEB3 = 'SET_WEB3'
// action creator
const getWeb3AndContract = (data) => {
  return {
    type: SET_WEB3,
    web3: data.web3,
    contract: data.contract,
    accounts: data.accounts
  }
}
// thunks

// establish connection with web3 (users account), and connection with contract
export const fetchWeb3AndContract = () => {
  console.log('fetch is running')
  return async (dispatch, getState) => {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = Nominate.networks[networkId]
      const contract = new web3.eth.Contract(
        Nominate.abi,
        deployedNetwork && deployedNetwork.address
      )
      console.log('end of try is running', getState())
      dispatch(getWeb3AndContract({web3, accounts, contract}))
    } catch (error) {
      console.log(error)
    }
  }
}

// reducer
const initialState = {
  web3: {},
  contractInstance: {},
  accounts: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WEB3:
      return {
        ...state,
        web3: action.web3,
        contractInstance: action.contract,
        accounts: action.accounts
      }
    default:
      return state
  }
}
