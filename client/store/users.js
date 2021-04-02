import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_ALL_NOMINEES = 'GET_ALL_NOMINEES';
/**
 * INITIAL STATE
 */
const allUsers = [];

/**
 * ACTION CREATORS
 */

const _getAllNominees = (users) => ({type: GET_ALL_NOMINEES, users});

/**
 * THUNK CREATORS
 */

export const getAllNominees = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users'); //figure out that later
    dispatch(_getAllNominees(res.data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function (state = allUsers, action) {
  switch (action.type) {
    case GET_ALL_NOMINEES:
      return action.users;
    default:
      return state;
  }
}
