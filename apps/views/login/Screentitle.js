import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';
import {convertWidth} from '../../configs/utils';
import {moderateScale} from '../../styles/scaling';
import {callVibrate} from './../../configs/utils';
import Constants from '../../configs/constant';

class Screentitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  buttonEvent(id_route) {
    callVibrate();
    this.props.navigation.navigate(id_route);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: convertWidth(50)}}
            source={require('../../assets/images/gifted.jpg')}
            resizeMode={'contain'}
          />
        </View>
        <View style={{flex: 1}}>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.buttonEvent('loginscreen')}>
            <Text>Login</Text>
          </Buttons>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.buttonEvent('registerscreen')}>
            <Text>Register</Text>
          </Buttons>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text>Version {Constants.APP_VERSION_DISPLAY}</Text>
        </View>
      </View>
    );
  }
}

export default Screentitle;
