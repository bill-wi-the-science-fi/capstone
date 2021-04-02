import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_ALL_AWARDS = 'GET_ALL_AWARDS';
const GET_ALL_USER_AWARDS = 'GET_ALL_USER_AWARDS';
const GET_ALL_USER_NOMS = 'GET_ALL_USER_NOMS';

const WITHDRAW_USER_AWARD = 'WITHDRAW_USER_AWARD';
/**
 * INITIAL STATE
 */
const awardslist = {
  allAwards: [],
  userAwards: [],
  userNominations: [],
  loading: true
};

/**
 * ACTION CREATORS
 */

const _getAllAwards = (awards) => ({type: GET_ALL_AWARDS, awards});
const _getAllUserAwards = (awards) => ({type: GET_ALL_USER_AWARDS, awards});
const _getAllUserNoms = (awards) => ({type: GET_ALL_USER_NOMS, awards});

const _withdrawAward = (award) => ({type: WITHDRAW_USER_AWARD, award});

/**
 * THUNK CREATORS
 */

export const getAllAwards = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/awards'); //figure out that later
    dispatch(_getAllAwards(res.data));
  } catch (err) {
    console.error(err);
  }
};
export const getAllUserAwards = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/user/${id}`); //figure out that later
    dispatch(_getAllUserAwards(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const getAllUserNoms = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/user/${id}/nominations`);
    dispatch(_getAllUserNoms(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const withdrawAward = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/awards/${id.id}/withdraw`, id); //figure out that later
    dispatch(_withdrawAward(res.data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function (state = awardslist, action) {
  switch (action.type) {
    case GET_ALL_AWARDS:
      return {...state, allAwards: action.awards};
    case GET_ALL_USER_AWARDS:
      return {...state, userAwards: action.awards, loading: false};
    case GET_ALL_USER_NOMS:
      return {...state, userNominations: action.awards, loading: false};
    case WITHDRAW_USER_AWARD:
      return {
        ...state,
        userAwards: state.userAwards.map((element) =>
          element.id === action.award.id ? action.award : element
        )
      };
    default:
      return state;
  }
}
