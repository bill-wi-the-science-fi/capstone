import axios from 'axios'

/**
 * ACTION TYPES
 */
const CREATE_AWARD = 'CREATE_AWARD'
const GET_ALL_AWARDS = 'GET_ALL_AWARDS'

/**
 * INITIAL STATE
 */
const allAwards = []

/**
 * ACTION CREATORS
 */

const _getAllAwards = (awards) => ({type: CREATE_AWARD, awards})
const _createAward = (newAward) => ({type: CREATE_AWARD, newAward})

/**
 * THUNK CREATORS
 */

export const getAllAwards = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/awards') //figure out that later
    dispatch(_getAllAwards(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const createAward = (nominatorUserID, nomineeEmail) => async (
  dispatch
) => {
  try {
    const res = await axios.post('/api/awards', {nominatorUserID, nomineeEmail}) //
    const newAward = res.data

    // add to users array
    dispatch(_createAward(newAward))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = allAwards, action) {
  switch (action.type) {
    case GET_ALL_AWARDS:
      return action.awards
    case CREATE_AWARD:
      return [...state, action.newAward]
    default:
      return state
  }
}
