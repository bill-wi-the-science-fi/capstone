import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ALL_AWARDS = 'GET_ALL_AWARDS'

/**
 * INITIAL STATE
 */
const allAwards = []

/**
 * ACTION CREATORS
 */

const _getAllAwards = (awards) => ({type: GET_ALL_AWARDS, awards})

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

/**
 * REDUCER
 */
export default function (state = allAwards, action) {
  switch (action.type) {
    case GET_ALL_AWARDS:
      return action.awards
    default:
      return state
  }
}
