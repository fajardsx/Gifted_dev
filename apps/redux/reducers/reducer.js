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
      avatar:
        'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg',
      alamat: '',
      kordinat: {
        latitude: -6.3125831,
        longitude: 106.859799,
        longitudeDelta: 0.005,
        latitudeDelta: 0.005,
      },
    },
    {
      id: 2,
      nama: 'Fajar',
      avatar:
        'https://images.pexels.com/photos/237018/pexels-photo-237018.jpeg',
      alamat: '',
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
