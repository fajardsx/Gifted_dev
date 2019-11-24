import ACTIONTYPE from '../actions/actions';

//init
const initState = {
  isFirst: true,
};

//reducers
const reducer = (state = initState, action) => {
  switch (action.type) {
    case ACTIONTYPE.CHANGE_STATUS_FIRSTTIME:
      return {...state, isFirst: action.value};
  }
  return state;
};

export default reducer;
