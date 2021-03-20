import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ALL_NOMINEES = 'GET_ALL_NOMINEES'
const NOMINATE_A_USER = 'NOMINATE_A_USER'
const CREATE_NEW_USER = 'CREATE_NEW_USER'

/**
 * INITIAL STATE
 */
const allUsers = []

/**
 * ACTION CREATORS
 */

const _getAllNominees = (users) => ({type: GET_ALL_NOMINEES, users})
const _nominateUser = (nominatedUser) => ({
  type: GET_ALL_NOMINEES,
  nominatedUser
})
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

export const nominateUser = (nominatorUserID, nomineeEmail) => async (
  dispatch
) => {
  try {
    // nominate user find or create,  set recipient in the API call
    // returns user
    const res = await axios.post('/api/users/nominate', {
      nominatorUserID,
      nomineeEmail
    }) //
    const nominatedUser = res.data

    // add to users array
    dispatch(_nominateUser(nominatedUser))
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
    case NOMINATE_A_USER:
      return [...state, action.nominatedUser]
    case CREATE_NEW_USER:
      return [...state, action.createdUser]
    default:
      return state
  }
}

// create an award
// add award to awards array
