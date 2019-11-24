
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reducer from  './reducers/reducer';

const persistConfig = {
    key:"root",
    storage:AsyncStorage
}

const persistreducer = persistReducer(persistConfig,reducer);

export default ()=>{
    let store = createStore(persistreducer);
    let persistor = persistStore(store)

    return {store, persistor};
}