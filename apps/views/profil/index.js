import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  TouchableHighlight,
} from 'react-native';
import {styles, colors} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {
  convertWidth,
  callVibrate,
  callAlert,
  validateEmail,
  convertHeight,
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
class ScreenProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailtxt: '',
      nametxt: '',
      phonetxt: '',
      addresstxt: '',
    };
  }
  componentDidMount() {
    console.log('profil/index.js => init user  ', this.props.user);
    this.setState({
      emailtxt: this.props.user.email,
      nametxt: this.props.user.name,
      phonetxt: this.props.user.nohp,
      addresstxt: this.props.user.alamat,
    });
  }
  onChangeEmailInput = text => {
    this.setState({emailtxt: text});
  };
  onChangeNameInput = text => {
    this.setState({nametxt: text});
  };
  onChangePhoneInput = text => {
    this.setState({phonetxt: text});
  };
  onChangeAddressInput = text => {
    this.setState({addresstxt: text});
  };
  onCancel() {
    this.props.navigation.goBack();
  }
  onTryUpdate() {
    // console.log('screenlogin', this.state.emailtxt);
    // console.log('screenlogin', this.state.passwordtxt);
    // console.log('screenlogin', this.state.nametxt);
    Keyboard.dismiss();

    if (this.state.nametxt.length < 2)
      return callAlert(Constants.NAME_APPS, 'Kolom Nama Tidak Lengkap');
    if (this.state.emailtxt.length < 2)
      return callAlert(Constants.NAME_APPS, 'Kolom Email Tidak Lengkap');

    if (validateEmail(this.state.emailtxt) == false)
      return callAlert(Constants.NAME_APPS, 'Format Email Tidak Sesuai');

    callVibrate();

    let bodyFormData = new FormData();
    bodyFormData.append('name', this.state.nametxt);
    bodyFormData.append('nohp', this.state.phonetxt);
    bodyFormData.append('alamat', this.state.addresstxt);
    bodyFormData.append('type', 'blind');
    callPost(API.UPDATE_PROFILE, bodyFormData, this.callbackupdate.bind(this));
  }
  callbackupdate(res) {
    console.log(res);
    if (res) {
      if (res.error) {
        callAlert(Constants.NAME_APPS, `${res.error}`);
        //callTo
      } else if (res.success) {
        this.props.updateuser(res.success);
        //this.props.updatetoken(res.success.token);
        let delay = setTimeout(() => {
          // this.props.navigation.navigate('inappscreen');
          this.props.navigation.goBack();
          clearTimeout(delay);
        }, 2000);
      }
    }
  }
  //
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            borderBottomWidth: 1,
            width: convertWidth(100),
            height: moderateScale(60),
          }}>
          <Text
            style={{
              marginLeft: moderateScale(20),
              fontSize: moderateScale(21),
            }}>
            {'Profil Saya'}
          </Text>
        </View>
        {
          //AVATAR
        }
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={[styles.profilsize, {margin: 10}]}>
            <Image
              style={[
                styles.profilsize,
                {borderRadius: moderateScale(100), overflow: 'hidden'},
              ]}
              source={
                this.props.user.avatar
                  ? {uri: this.props.user.avatar}
                  : require('../../assets/images/profilpicture.png')
              }
              resizeMode={'cover'}
            />
          </View>
          <TouchableHighlight>
            <Text>Ubah Foto</Text>
          </TouchableHighlight>
        </View>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}} enabled>
          {
            // DATA PROFIL FORM
          }
          <Forminput
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.nametxt}
            onChangeText={this.onChangeNameInput}
            styleinput={{borderWidth: 1, paddingLeft: 10}}
            title={'Nama'}
          />
          <Forminput
            keyboardtype={'email-address'}
            editable={false}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.emailtxt}
            onChangeText={this.onChangeEmailInput}
            styleinput={{borderWidth: 1, paddingLeft: 10}}
            title={'Email'}
          />
          <Forminput
            keyboardtype={'phone-pad'}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.phonetxt}
            onChangeText={this.onChangePhoneInput}
            styleinput={{borderWidth: 1, paddingLeft: 10}}
            title={'No Hp'}
          />
          <Forminput
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.addresstxt}
            onChangeText={this.onChangeAddressInput}
            styleinput={{borderWidth: 1, paddingLeft: 10}}
            title={'Alamat'}
          />
        </KeyboardAvoidingView>
        <View
          style={{
            //flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            backgroundColor: colors.main.COLOR_PRIMARY_2,
          }}>
          <Buttons
            style={{width: convertWidth(50), margin: 10}}
            onPressButton={this.onTryUpdate.bind(this)}>
            <Text>Save</Text>
          </Buttons>
          <Buttons
            style={{width: convertWidth(50), margin: 10}}
            onPressButton={this.onCancel.bind(this)}>
            <Text>Cancel</Text>
          </Buttons>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    user: state.user,
  };
}
function dispatchToProps(dispatch) {
  return {
    updatetoken: user =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TOKEN,
        value: user,
      }),
    updateuser: data =>
      dispatch({
        type: ACTION_TYPE.UPDATE_USER,
        value: data,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(ScreenProfile);
