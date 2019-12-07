import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {styles, images} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {
  convertWidth,
  callVibrate,
  callAlert,
  validateEmail,
  loadingScreen,
  showToast,
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
      isloading: false,
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

    if (this.state.nametxt.length < 2)
      return showToast('Kolom Nama Tidak Lengkap');
    if (this.state.emailtxt.length < 2)
      return showToast('Kolom Email Tidak Lengkap');
    if (this.state.passwordtxt.length < 6)
      return showToast('Kolom Password Tidak Lengkap');
    if (this.state.password2txt.length < 6)
      return showToast('Kolom Ulangi Password Tidak Lengkap');

    if (validateEmail(this.state.emailtxt) == false)
      return showToast('Format Email Tidak Sesuai');
    if (usermodal.password != usermodal.password2)
      return showToast('Passowrd tidak sama');
    callVibrate();
    this.setState({isloading: true});
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
    this.setState({isloading: false});
    if (res) {
      if (res.error) {
        showToast(`${res.error}`);
        //callTo
      } else if (res.success) {
        //this.props.updateuser(usermodal);
        showToast('Daftar Berhasil');
        this.props.updatetoken(res.success.token);
        let delay = setTimeout(() => {
          this.props.navigation.navigate('inappscreen');
          clearTimeout(delay);
        }, 2000);
      }
    } else {
      showToast('Gagal Daftar');
    }
  }
  //
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={styles.container}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{width: convertWidth(25), height: moderateScale(100)}}
              source={images.logo}
              resizeMode={'contain'}
            />
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
            <Buttons
              style={{width: convertWidth(100), marginTop: moderateScale(20)}}
              onPressButton={this.onTryLRegister.bind(this)}>
              <Text>Register</Text>
            </Buttons>
          </View>
        </TouchableWithoutFeedback>
        {this.state.isloading && loadingScreen()}
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
    updatetoken: user =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TOKEN,
        value: user,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(ScreenRegister);
