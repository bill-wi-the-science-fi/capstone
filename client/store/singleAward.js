import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_SINGLE_AWARD = 'GET_SINGLE_AWARD'
const EDIT_SINGLE_AWARD = 'EDIT_SINGLE_AWARD'
const CLEAR_SINGLE_AWARD = 'CLEAR_SINGLE_AWARD'

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

const _editSingleAward = (singleAward) => ({
  type: EDIT_SINGLE_AWARD,
  singleAward
})

export const clearSingleAward = () => ({
  type: CLEAR_SINGLE_AWARD
})

/**
 * THUNK CREATORS
 */

export const getSingleAward = (awardId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/awards/${awardId}`)
    const flatten = flattenObj(res.data)
    dispatch(_getSingleAward(flatten))
  } catch (err) {
    console.error(err)
  }
}

export const editSingleAward = (awardId, formValues) => async (dispatch) => {
  console.log('inside thunk')
  try {
    const res = await axios.put(`/api/awards/${awardId}/edit`, formValues)
    dispatch(_editSingleAward(res.data))
    history.push(`/awards/${awardId}`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  console.log('inside reducer')

  switch (action.type) {
    case GET_SINGLE_AWARD:
      return action.singleAward
    case EDIT_SINGLE_AWARD:
      return action.singleAward
    case CLEAR_SINGLE_AWARD:
      return initialState
    default:
      return state
  }
}
