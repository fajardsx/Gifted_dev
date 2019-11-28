import ACTIONTYPE from '../actions/actions';

//init
const initState = {
  isFirst: true,
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
  ],
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
