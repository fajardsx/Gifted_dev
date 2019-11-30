import ACTIONTYPE from '../actions/actions';
import MODAL from '../modals/index';
//init
const initState = {
  isFirst: true,
  user: null,
  currentFriendTarget: null,
  friendlist: [
    {
      id: 1,
      nama: 'Agung',
      kordinat: {
        latitude: -6.1904393,
        longitude: 106.7973387,
        longitudeDelta: 0.005,
        latitudeDelta: 0.005,
      },
    },
    {
      id: 2,
      nama: 'Fajar',
      kordinat: {
        latitude: -6.203356,
        longitude: 106.766962,
        longitudeDelta: 0.005,
        latitudeDelta: 0.005,
      },
    },
  ],
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
  }
  return state;
};

export default reducer;
