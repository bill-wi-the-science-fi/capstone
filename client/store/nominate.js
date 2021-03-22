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

const _nominateUser = (awardAndRecipient) => ({
  type: NOMINATE_A_USER,
  awardAndRecipient
})
/**
 * THUNK CREATORS
 */

/*
const sentFromFont = {
  title: '',
  category: '',
  description: '',
  img: '',
  donationLimit: '',
  nominatorObject: '',
  nomineeEmail: '',
  nomineeFirst: '',
  nomineeLast: '',
  initialDonation: ''
}
 */
export const nominateUser = (sentFromFront) => async (dispatch) => {
  try {
    // nominate user find or create,  set recipient in the API call
    // returns user
    const res = await axios.post('/api/nominate', sentFromFront) //
    const awardAndRecipient = res.data
    // add to users array
    dispatch(_nominateUser(awardAndRecipient))
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
      return action.awardAndRecipient
    default:
      return state
  }
}
