import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import signedInUser from './signedInUser'
import users from './users'
import awards from './awards'
import singleAward from './singleAward'
import nominate from './nominate'
import contract from './contract'
import transactions from './transactions'
import singleUser from './singleUser'

const reducer = combineReducers({
  signedInUser,
  users, // array initial State // Nomiation lives here
  singleUser,
  awards, // array initialState // create award triggers after Nomination and lives here
  singleAward, // Object initialState
  nominate,
  contract,
  transactions
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './signedInUser'
export * from './users'
export * from './singleUser'
export * from './awards'
export * from './singleAward'
export * from './nominate'
export * from './transactions'

/*
store =
{
  signedInUser: {userObject}
  users: [AllUsersArray]
  awards: [AllAwardsArray]
  singleAward: {SingleAwardObject}
  nominate: {}
}
 */
