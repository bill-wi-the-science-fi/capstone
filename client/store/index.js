import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import signedInUser from './signedInUser'
import users from './users'
import awards from './awards'
import singleAward from './singleAward'

const reducer = combineReducers({
  signedInUser,
  users, // array initial State // Nomiation lives here
  awards, // array initialState // create award triggers after Nomination and lives here
  singleAward, // Object initialState
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './signedInUser'
export * from './users'
export * from './awards'
export * from './singleAward'
