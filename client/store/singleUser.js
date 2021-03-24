import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_NEW_USER = 'CREATE_NEW_USER'
const CHECK_PIN = 'CHECK_PIN'

/**
 * INITIAL STATE
 */
const singleUser = {}

/**
 * ACTION CREATORS
 */

const _createUser = (createdUser) => ({
  type: CREATE_NEW_USER,
  createdUser
})

const _checkPin = (checkedPin) => ({
  type: CHECK_PIN,
  checkedPin
})

/**
 * THUNK CREATORS
 */

export const createUser = (email) => async (dispatch) => {
  try {
    const res = await axios.post('/api/user', {email})
    const createdUser = res.data
    dispatch(_createUser(createdUser))
  } catch (err) {
    console.error(err)
  }
}

export const checkPin = (stuff) => async (dispatch) => {
  console.log('\n --------🚀 \n checkPin \n stuff', stuff)
  try {
    // http://localhost:8080/signup/?email=cole2@email.com&pin=1234
    const res = await axios.put('/api/user', stuff)
    const hasPin = res.data
    dispatch(_checkPin(hasPin))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = singleUser, action) {
  switch (action.type) {
    case CREATE_NEW_USER:
      return action.createdUser
    case CHECK_PIN:
      return action.checkPin
    default:
      return state
  }
}
