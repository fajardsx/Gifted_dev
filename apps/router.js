import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import InitScreen from './views/initscreen';
import {createStackNavigator} from 'react-navigation-stack';
import Screentitle from './views/login/Screentitle';
import Screenlogin from './views/login/Screenlogin';
import ScreenRegister from './views/login/Screenregister';
import HomeScreen from './views/home';
import searchresultscreen from './views/home/searchresultscreen';

const TitleScene = createStackNavigator(
  {
    titleinitscreen: {
      screen: Screentitle,
    },
    loginscreen: {
      screen: Screenlogin,
    },
    registerscreen: {
      screen: ScreenRegister,
    },
  },
  {
    initialRouteName: 'titleinitscreen',
    headerMode: 'none',
  },
);
const InAppScene = createStackNavigator(
  {
    homescreen: {
      screen: HomeScreen,
    },
    resultsearchscreen: {
      screen: searchresultscreen,
    },
  },
  {
    initialRouteName: 'homescreen',
    headerMode: 'none',
  },
);
const MainApplication = createSwitchNavigator(
  {
    initscreen: {
      screen: InitScreen,
    },
    titlescreen: {
      screen: TitleScene,
    },
    inappscreen: {
      screen: InAppScene,
    },
  },
  {
    initialRouteName: 'initscreen',
    headerMode: 'none',
  },
);

export default createAppContainer(MainApplication);
