import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';

class Screentitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text>Gifted</Text>
        </View>
        <View style={{flex: 1}}>
          <Buttons>
            <Text>Login</Text>
          </Buttons>
          <Buttons>
            <Text>Register</Text>
          </Buttons>
        </View>
      </View>
    );
  }
}

export default Screentitle;
