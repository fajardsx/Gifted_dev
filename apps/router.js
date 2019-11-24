import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import InitScreen from './views/initscreen';

const MainApplication = createSwitchNavigator(
  {
    init_screen: {
      screen: InitScreen,
    },
  },
  {
    initialRouteName: 'init_screen',
    headerMode: 'none',
  },
);

export default createAppContainer(MainApplication);
