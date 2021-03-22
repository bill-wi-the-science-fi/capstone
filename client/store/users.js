import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ALL_NOMINEES = 'GET_ALL_NOMINEES'
const CREATE_NEW_USER = 'CREATE_NEW_USER'

/**
 * INITIAL STATE
 */
const allUsers = []

/**
 * ACTION CREATORS
 */

const _getAllNominees = (users) => ({type: GET_ALL_NOMINEES, users})
const _createUser = (createdUser) => ({
  type: CREATE_NEW_USER,
  createdUser
})
/**
 * THUNK CREATORS
 */

export const getAllNominees = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users') //figure out that later
    dispatch(_getAllNominees(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const createUser = (email) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users', {email})
    const createdUser = res.data
    dispatch(_createUser(createdUser))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = allUsers, action) {
  switch (action.type) {
    case GET_ALL_NOMINEES:
      return action.users
    case CREATE_NEW_USER:
      return [...state, action.createdUser]
    default:
      return state
  }
}
