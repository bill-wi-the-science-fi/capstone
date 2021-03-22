import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_AWARD = 'GET_SINGLE_AWARD'
// const AWARD_DONATION = 'AWARD_DONATION'

/**
 * INITIAL STATE
 */
const singleAward = {}

/**
 * ACTION CREATORS
 */

const _getSingleAward = (singleAward) => ({type: GET_SINGLE_AWARD, singleAward})
// const _awardDonation = () => ({type: GET_SINGLE_AWARD, })

/**
 * THUNK CREATORS
 */

export const getSingleAward = (awardId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/awards/${awardId}`) //figure out that later
    dispatch(_getSingleAward(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = singleAward, action) {
  switch (action.type) {
    case GET_SINGLE_AWARD:
      return action.singleAward
    default:
      return state
  }
}
