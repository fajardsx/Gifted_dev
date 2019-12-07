import React from 'react';
import {Image} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import InitScreen from './views/initscreen';
import {createStackNavigator} from 'react-navigation-stack';
import Screentitle from './views/login/Screentitle';
import Screenlogin from './views/login/Screenlogin';
import ScreenRegister from './views/login/Screenregister';
import HomeScreen from './views/home';
import searchresultscreen from './views/home/searchresultscreen';
import SettingScreen from './views/settings';
import KontakScreen from './views/settings/kontaksaya';
import CariKontakScreen from './views/settings/carikontak';
import KontakDetailScreen from './views/kontak';
import ProfileScreen from './views/profil/index';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {colors, images, styles} from './styles';
import {convertHeight} from './configs/utils';
import {moderateScale} from './styles/scaling';

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
const KontakScene = createAppContainer(
  createStackNavigator(
    {
      detailscreen: {
        screen: KontakDetailScreen,
      },
      detaileditscreen: {
        screen: KontakDetailScreen,
      },
    },
    {
      initialRouteName: 'detailscreen',
      headerMode: 'none',
    },
  ),
);
const TabApp = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    'Kontak Saya': {
      screen: KontakScreen,
    },
    'Cari Teman': {
      screen: CariKontakScreen,
    },
  },
  {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: colors.tabsstyle.COLOR_PRIMARY_1,
      inactiveTintColor: '#939393',
      indicatorStyle: {
        backgroundColor: colors.tabsstyle.COLOR_PRIMARY_1,
        height: 5,
      },
      showIcon: true,
      showLabel: true,
      labelStyle: {
        fontSize: moderateScale(13),
      },
      style: {
        backgroundColor: '#FFF',
        height: convertHeight(11),
      },
      tabStyle: {
        height: 64,
        //borderRightWidth: 0.5,
        //borderRightColor: "#939393"
      },
      iconStyle: {
        paddingBottom: 10,
        paddingTop: 10,
      },
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let icons = null;
        if (routeName === 'Home') {
          icons = (
            <Image
              source={images.iconhome}
              style={styles.tabicon}
              tintColor={tintColor}
            />
          );
        } else if (routeName === 'Kontak Saya') {
          icons = (
            <Image
              source={images.iconcontact}
              style={styles.tabicon}
              tintColor={tintColor}
            />
          );
        } else if (routeName === 'Cari Teman') {
          icons = (
            <Image
              source={images.iconaddcontact}
              style={styles.tabicon}
              tintColor={tintColor}
            />
          );
        }
        return icons;
      },
    }),
  },
);
const InAppScene = createStackNavigator(
  {
    tabs: {
      screen: TabApp,
    },

    resultsearchscreen: {
      screen: searchresultscreen,
    },
    settingscreen: {
      screen: SettingScreen,
    },
    detailkontakscreen: {
      screen: props => <KontakScene screenProps={props} />,
    },
    profilescreen: {
      screen: ProfileScreen,
    },
  },
  {
    initialRouteName: 'tabs',
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
