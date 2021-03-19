import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ALL_NOMINEES = 'GET_ALL_NOMINEES'
const NOMINATE_A_USER = 'NOMINATE_A_USER'

/**
 * INITIAL STATE
 */
const allUsers = []

/**
 * ACTION CREATORS
 */

const _getAllNominees = () => ({type: GET_ALL_NOMINEES, users})
const _nominateUser = (nominatedUser) => ({
  type: GET_ALL_NOMINEES,
  nominatedUser,
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
    const res = await axios.post('/api/users', {nominatorUserID, nomineeEmail}) //
    const nominatedUser = res.data

    // add to users array
    dispatch(_nominateUser(nominatedUser))
  } catch (err) {
    console.error(err)
  }
}
// THERE WILL NEED TO BE A SEPARATE ACTION TO JUST HAVE A USER CREATE AN ACCOUNT

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_ALL_NOMINEES:
      return action.users
    case NOMINATE_A_USER:
      return [...state, action.nominatedUser]
    default:
      return state
  }
}

// create an award
// add award to awards array
