import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';
import {convertWidth} from '../../configs/utils';
import {moderateScale} from '../../styles/scaling';
import {callVibrate} from './../../configs/utils';

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
          <Text style={{fontSize: moderateScale(21)}}>Gifted</Text>
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
      </View>
    );
  }
}

export default Screentitle;
