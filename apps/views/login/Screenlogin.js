import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';

class Screenlogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Buttons>
          <Text>Login</Text>
        </Buttons>
      </View>
    );
  }
}

export default Screenlogin;
