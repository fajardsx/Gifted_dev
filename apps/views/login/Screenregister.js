import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {convertWidth} from '../../configs/utils';
import Forminput from '../../components/Forminput';

class ScreenRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailtxt: '',
      nametxt: '',
      passwordtxt: '',
    };
  }
  onChangeEmailInput = text => {
    this.setState({emailtxt: text});
  };
  onChangeNameInput = text => {
    this.setState({nametxt: text});
  };
  onChangePasswordInput = text => {
    this.setState({passwordtxt: text});
  };
  onTryLRegister() {
    // console.log('screenlogin', this.state.emailtxt);
    // console.log('screenlogin', this.state.passwordtxt);
    // console.log('screenlogin', this.state.nametxt);
    this.props.navigation.navigate('inappscreen');
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: moderateScale(21),
              paddingBottom: moderateScale(50),
            }}>
            Gifted
          </Text>
          <Text
            style={{
              fontSize: moderateScale(15),
              //paddingBottom: moderateScale(50),
            }}>
            Register
          </Text>
          <Forminput
            keyboardtype={'email-address'}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.emailtxt}
            onChangeText={this.onChangeEmailInput}
            title={'Email'}
          />
          <Forminput
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.nametxt}
            onChangeText={this.onChangeNameInput}
            title={'Name'}
          />
          <Forminput
            securetxt={true}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.epasswordtxtailtxt}
            onChangeText={this.onChangePasswordInput}
            title={'Password'}
          />
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            //alignItems: 'center',
          }}>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={this.onTryLRegister.bind(this)}>
            <Text>Register</Text>
          </Buttons>
        </View>
      </SafeAreaView>
    );
  }
}

export default ScreenRegister;
