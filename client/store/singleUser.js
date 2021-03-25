import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_VERIFIED_USER = 'CREATE_VERIFIED_USER'
const CHECK_PIN = 'CHECK_PIN'

/**
 * INITIAL STATE
 */
const singleUser = {}

/**
 * ACTION CREATORS
 */

const _createVerifiedUser = (createdVerifiedUser) => ({
  type: CREATE_VERIFIED_USER,
  createdVerifiedUser
})

const _checkPin = (checkedPin) => ({
  type: CHECK_PIN,
  checkedPin
})

/**
 * THUNK CREATORS
 */

export const createVerifiedUser = (userInfo) => async (dispatch) => {
  try {
    const res = await axios.put('/api/user/verified', userInfo)
    const createdVerifiedUser = res.data
    dispatch(_createVerifiedUser(createdVerifiedUser))
  } catch (err) {
    console.error(err)
  }
}

//if verified is true, then run a dispatch this instead of authme

export const checkPin = (stuff) => async (dispatch) => {
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
    case CREATE_VERIFIED_USER:
      return action.createdVerifiedUser
    case CHECK_PIN:
      return action.checkedPin
    default:
      return state
  }
}
