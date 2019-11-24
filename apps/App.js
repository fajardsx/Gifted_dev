import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
//redux
import configstore from './redux/configstore';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import MainApplication from './router';

//authorize
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
console.disableYellowBox = true;

//redux config

var context = null;
const {store, persistor} = configstore();

const MyApp = () => {
  return (
    <Provider
      store={store}
      style={[styles.container, {backgroundColor: '#d1d1d1'}]}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApplication style={[styles.containerDimension]} />
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
