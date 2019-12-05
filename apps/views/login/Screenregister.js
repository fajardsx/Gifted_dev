import React, {Component} from 'react';
import {View, Text, SafeAreaView, Keyboard} from 'react-native';
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {
  convertWidth,
  callVibrate,
  callAlert,
  validateEmail,
} from '../../configs/utils';
import Forminput from '../../components/Forminput';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
import MODAL from '../../redux/modals';
import {callPost} from '../../services';
import API from '../../services/common/api';
import Constants from '../../configs/constant';
let usermodal = MODAL.user;
class ScreenRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailtxt: '',
      nametxt: '',
      passwordtxt: '',
      password2txt: '',
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
  onChangePassword2Input = text => {
    this.setState({password2txt: text});
  };
  onTryLRegister() {
    // console.log('screenlogin', this.state.emailtxt);
    // console.log('screenlogin', this.state.passwordtxt);
    // console.log('screenlogin', this.state.nametxt);
    Keyboard.dismiss();
    usermodal.name = this.state.nametxt;
    usermodal.email = this.state.emailtxt;
    usermodal.password = this.state.passwordtxt;
    usermodal.password2 = this.state.password2txt;

    if (Constants.DEV_MODE) {
      this.props.navigation.navigate('inappscreen');
      this.props.updateuser(usermodal);
    }

    if (this.state.nametxt.length < 2)
      return callAlert(Constants.NAME_APPS, 'Kolom Nama Tidak Lengkap');
    if (this.state.emailtxt.length < 2)
      return callAlert(Constants.NAME_APPS, 'Kolom Email Tidak Lengkap');
    if (this.state.passwordtxt.length < 6)
      return callAlert(Constants.NAME_APPS, 'Kolom Password Tidak Lengkap');
    if (this.state.password2txt.length < 6)
      return callAlert(
        Constants.NAME_APPS,
        'Kolom Ulangi Password Tidak Lengkap',
      );

    if (validateEmail(this.state.emailtxt) == false)
      return callAlert(Constants.NAME_APPS, 'Format Email Tidak Sesuai');
    if (usermodal.password != usermodal.password2)
      return callAlert(Constants.NAME_APPS, 'Passowrd tidak sama');
    callVibrate();

    let bodyFormData = new FormData();
    bodyFormData.append('name', this.state.nametxt);
    bodyFormData.append('email', this.state.emailtxt);
    bodyFormData.append('password', this.state.passwordtxt);
    bodyFormData.append('c_password', this.state.password2txt);
    bodyFormData.append('type', 'blind');
    callPost(API.REGISTER, bodyFormData, this.callbackregister.bind(this));
  }
  callbackregister(res) {
    console.log(res);
    if (res) {
      if (res.error) {
        callAlert(Constants.NAME_APPS, `${res.error}`);
        //callTo
      } else if (res.success) {
        this.props.updateuser(usermodal);
        this.props.updatetoken(res.success.token);
        let delay = setTimeout(() => {
          this.props.navigation.navigate('inappscreen');
          clearTimeout(delay);
        }, 2000);
      }
    }
  }
  //
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: moderateScale(21),
              paddingBottom: moderateScale(40),
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
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.nametxt}
            onChangeText={this.onChangeNameInput}
            styleinput={{borderBottomWidth: 1}}
            title={'Name'}
          />
          <Forminput
            keyboardtype={'email-address'}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.emailtxt}
            onChangeText={this.onChangeEmailInput}
            styleinput={{borderBottomWidth: 1}}
            title={'Email'}
          />

          <Forminput
            securetxt={true}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.passwordtxt}
            onChangeText={this.onChangePasswordInput}
            styleinput={{borderBottomWidth: 1}}
            title={'Password'}
          />
          <Forminput
            securetxt={true}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.password2txt}
            onChangeText={this.onChangePassword2Input}
            styleinput={{borderBottomWidth: 1}}
            title={'Ulangi Password'}
          />
        </View>
        <View
          style={{
            //flex: 0.5,
            justifyContent: 'center',
            //alignItems: 'center',
          }}>
          <Buttons
            style={{width: convertWidth(100)}}
            onPressButton={this.onTryLRegister.bind(this)}>
            <Text>Register</Text>
          </Buttons>
        </View>
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
  };
}
function dispatchToProps(dispatch) {
  return {
    updateuser: user =>
      dispatch({
        type: ACTION_TYPE.UPDATE_USER,
        value: user,
      }),
    updatetoken: user =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TOKEN,
        value: user,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(ScreenRegister);
