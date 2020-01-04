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

class ScreenResetpassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passtxt: '', //password baru
      passtxtverifikasi: '',
      codetxt: '',
      isloading: false,
      issend: false,
    };
  }
  onChangeEmailInput = text => {
    this.setState({passtxt: text});
  };
  onChangeVerEmailInput = text => {
    this.setState({passtxtverifikasi: text});
  };

  //API

  onSubmitResetPassword() {
    Keyboard.dismiss();

    callVibrate();
    if (this.state.passtxt.length < 1) {
      return showToast('Mohon Isi Email');
    }
    if (this.state.passtxtverifikasi.length < 1) {
      return showToast('Mohon Isi Email kembali');
    }
    if (this.state.passtxtverifikasi !== this.state.passtxt) {
      return showToast('Password  tidak sama');
    }
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    this.setState({isloading: true});
    let bodyFormData = new FormData();
    bodyFormData.append('password', this.state.passtxt);
    callPost(
      API.RESET_PASSWORD,
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
            showToast(`Password Behasil diGanti`);
            //this.setState({issend: true});
            this.props.navigation.navigate('loginscreen');
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

          {this.addSendForm()}
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
          Code terverifikasi silahkan Password Baru Anda
        </Text>
        <Forminput
          securetxt={true}
          stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
          defaultText={this.state.passtxt}
          onChangeText={this.onChangeEmailInput}
          styleinput={{borderBottomWidth: 1}}
          title={'Masukkan Password Baru'}
        />
        <Forminput
          securetxt={true}
          stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
          defaultText={this.state.passtxtverifikasi}
          onChangeText={this.onChangeVerEmailInput}
          styleinput={{borderBottomWidth: 1}}
          title={'Tulis Ulang Password Baru'}
        />
        <Buttons
          style={{
            marginTop: moderateScale(50),
            margin: 10,
            width: convertWidth(95),
          }}
          onPressButton={this.onSubmitResetPassword.bind(this)}>
          <Text>Submit</Text>
        </Buttons>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    token: state.token,
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
export default connect(mapStateToProps, dispatchToProps)(ScreenResetpassword);
