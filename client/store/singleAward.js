import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_AWARD = 'GET_SINGLE_AWARD'

// const AWARD_DONATION = 'AWARD_DONATION'

function flattenObj(obj, parent, res = {}) {
  for (let key in obj) {
    let propName = parent ? parent + '_' + key : key
    if (typeof obj[key] == 'object') {
      flattenObj(obj[key], propName, res)
    } else {
      res[propName] = obj[key]
    }
  }
  return res
}

/**
 * INITIAL STATE
 */
const initialState = {}

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
    const flatten = flattenObj(res.data)
    dispatch(_getSingleAward(flatten))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SINGLE_AWARD:
      return action.singleAward
    default:
      return state
  }
}
