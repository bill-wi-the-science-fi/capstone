import axios from 'axios'

/**
 * ACTION TYPES
 */
const NOMINATE_A_USER = 'NOMINATE_A_USER'

/**
 * INITIAL STATE
 */
const nominate = {}

/**
 * ACTION CREATORS
 */

const _nominateUser = (nominatedUser) => ({
  type: GET_ALL_NOMINEES,
  nominatedUser
})
/**
 * THUNK CREATORS
 */

export const nominateUser = (nominatorUserID, nomineeEmail) => async (
  dispatch
) => {
  try {
    // nominate user find or create,  set recipient in the API call
    // returns user
    const res = await axios.post('/api/nominate', {
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

/**
 * REDUCER
 */
export default function (state = nominate, action) {
  switch (action.type) {
    case NOMINATE_A_USER:
      return [...state, action.nominatedUser]
    default:
      return state
  }
}

// create an award
// add award to awards array
