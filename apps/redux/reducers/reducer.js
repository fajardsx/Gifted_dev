import ACTIONTYPE from '../actions/actions';
import MODAL from '../modals/index';
//init
const initState = {
  isFirst: true,
  token: null,
  user: MODAL.user,
  currentFriendTarget: null,
  friendlist: [],
  appmode: 0,
};

//reducers
const reducer = (state = initState, action) => {
  switch (action.type) {
    case ACTIONTYPE.CHANGE_STATUS_FIRSTTIME:
      return {...state, isFirst: action.value};
    case ACTIONTYPE.UPDATE_USER:
      return {...state, user: action.value};
    case ACTIONTYPE.UPDATE_TARGET:
      return {...state, currentFriendTarget: action.value};
    case ACTIONTYPE.UPDATE_TOKEN:
      return {...state, token: action.value};
    case ACTIONTYPE.UPDATE_KONTAKLIST:
      return {...state, friendlist: action.value};
    case ACTIONTYPE.UPDATE_MODE:
      return {...state, appmode: action.value};
    case ACTIONTYPE.USER_LOGOUT:
      return {
        isFirst: true,
        token: null,
        user: MODAL.user,
        currentFriendTarget: null,
        friendlist: [],
        appmode: 0,
      };
  }
  return state;
};

export default reducer;
