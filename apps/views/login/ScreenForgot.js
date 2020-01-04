import React, {Component} from 'react';
import {View, Text, Image, Keyboard} from 'react-native';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {
  convertWidth,
  callAlert,
  showToast,
  validateEmail,
  loadingScreen,
} from '../../configs/utils';
import Forminput from '../../components/Forminput';
import {callVibrate} from '../../configs/utils';
import {postLogin, callPost} from '../../services';
import API from '../../services/common/api';
import Constants from '../../configs/constant';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SafeAreaView from 'react-native-safe-area-view';

class Screenforgotpassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailtxt: '',
      codetxt: '',
      isloading: false,
      issend: false,
    };
  }
  onChangeEmailInput = text => {
    this.setState({emailtxt: text});
  };
  onChangeCodeInput = text => {
    this.setState({codetxt: text});
  };

  //API

  onSubmitForgotPassword() {
    Keyboard.dismiss();

    callVibrate();
    if (this.state.emailtxt.length < 1) {
      return showToast('Mohon Isi Email');
    }
    if (validateEmail(this.state.emailtxt) == false) {
      return showToast('Format Email tidak sesuai');
    }
    this.setState({isloading: true});
    let bodyFormData = new FormData();
    bodyFormData.append('email', this.state.emailtxt);
    callPost(
      API.FORGOT_PASSWORD,
      bodyFormData,
      (onCallbBackForgotPassword = res => {
        this.setState({isloading: false});
        console.log(res);
        if (res) {
          if (res.error) {
            //callTo
            showToast(`${res.error}, Gagal Masuk`);
            //callAlert(Constants.NAME_APPS, `${res.error}, Gagal Masuk`);
          } else if (res.success) {
            showToast(`Permintaan Behasil`);
            this.setState({issend: true});
          }
        } else {
          showToast('Gagal Login');
        }
      }),
    );
  }
  onSubmitCodePassword() {
    Keyboard.dismiss();

    callVibrate();
    if (this.state.emailtxt.length < 1) {
      return showToast('Mohon Isi Email');
    }
    if (this.state.codetxt.length < 1) {
      return showToast('Mohon Isi Kode Verifikasi');
    }
    if (validateEmail(this.state.emailtxt) == false) {
      return showToast('Format Email tidak sesuai');
    }
    this.setState({isloading: true});
    let bodyFormData = new FormData();
    bodyFormData.append('email', this.state.emailtxt);
    bodyFormData.append('code', this.state.codetxt);
    callPost(
      API.SEND_CODE,
      bodyFormData,
      (onCallbBackSendCode = res => {
        this.setState({isloading: false});
        console.log(res);
        if (res) {
          if (res.error) {
            //callTo
            showToast(`${res.error}, Gagal Masuk`);
            //callAlert(Constants.NAME_APPS, `${res.error}, Gagal Masuk`);
          } else if (res.success) {
            showToast(`Permintaan Behasil`);
            //this.setState({issend: true});
            this.props.updatetoken(res.success.token);
            this.props.navigation.navigate('resetpasswordscreen');
          }
        } else {
          showToast('Gagal Login');
        }
      }),
    );
  }
  //
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Image
              style={{width: convertWidth(50), height: moderateScale(150)}}
              source={require('../../assets/images/gifted.jpg')}
              resizeMode={'contain'}
            />
          </View>

          {this.state.issend == false && this.addSendForm()}
          {this.state.issend == true && this.addSendCodeForm()}
          <View style={{flex: 1}} />
        </View>
        {this.state.isloading && loadingScreen()}
      </SafeAreaView>
    );
  }

  addSendForm() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(15),
            //paddingBottom: moderateScale(50),
          }}>
          Lupa Password
        </Text>
        <Text
          style={{
            fontSize: moderateScale(15),
            //paddingBottom: moderateScale(50),
          }}>
          Silahkan masukan email untuk merubah kata sandi
        </Text>
        <Forminput
          stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
          defaultText={this.state.emailtxt}
          onChangeText={this.onChangeEmailInput}
          styleinput={{borderBottomWidth: 1}}
          title={'Email'}
        />
        <Buttons
          style={{
            marginTop: moderateScale(50),
            margin: 10,
            width: convertWidth(95),
          }}
          onPressButton={this.onSubmitForgotPassword.bind(this)}>
          <Text>Submit</Text>
        </Buttons>
      </View>
    );
  }
  addSendCodeForm() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(15),
            //paddingBottom: moderateScale(50),
          }}>
          Lupa Password
        </Text>
        <Text
          style={{
            fontSize: moderateScale(15),
            marginLeft: 10,
            //paddingBottom: moderateScale(50),
          }}>
          Kode Verifikasi sudah dikirim ke email Kamu ,Segera Masukan Kode
        </Text>
        <Forminput
          stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
          defaultText={this.state.emailtxt}
          onChangeText={this.onChangeEmailInput}
          styleinput={{borderBottomWidth: 1}}
          title={'Email'}
        />
        <Forminput
          stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
          defaultText={this.state.codetxt}
          onChangeText={this.onChangeCodeInput}
          styleinput={{borderBottomWidth: 1}}
          title={'Kode Verifikasi'}
        />
        <Buttons
          style={{
            marginTop: moderateScale(50),
            margin: 10,
            width: convertWidth(95),
          }}
          onPressButton={this.onSubmitCodePassword.bind(this)}>
          <Text>Submit</Text>
        </Buttons>
      </View>
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
export default connect(mapStateToProps, dispatchToProps)(Screenforgotpassword);
