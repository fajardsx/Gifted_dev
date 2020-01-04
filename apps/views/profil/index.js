import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
//
import {styles, colors, fonts} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {
  convertWidth,
  callVibrate,
  callAlert,
  validateEmail,
  convertHeight,
  showToast,
  loadingScreen,
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

const options = {
  title: 'Pilih Avatar/Foto Profil',
};

class ScreenProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailtxt: '',
      nametxt: '',
      phonetxt: '',
      addresstxt: '',
      tempavatar: null,
      isloading: false,
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
  onCallSave() {
    if (this.state.tempavatar) {
      this.onUploadAvatar();
    } else {
      this.onTryUpdate();
    }
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
    this.setState({isloading: true});
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
    this.setState({isloading: false});
    if (res) {
      if (res.error) {
        //callAlert(Constants.NAME_APPS, `${res.error}`);
        showToast(`${res.error}`);
        //callTo
      } else if (res.success) {
        this.props.updateuser(res.success);
        //this.props.updatetoken(res.success.token);
        showToast('Berhasil Ubah Data Profil');
        let delay = setTimeout(() => {
          // this.props.navigation.navigate('inappscreen');
          this.props.navigation.goBack();
          clearTimeout(delay);
        }, 2000);
      }
    } else {
      showToast('Gagal Ubah Foto Profil');
    }
  }
  onUploadAvatar() {
    /*
     {
            uri: source.uri,
            type: source.type,
            name: source.fileName
        }*/
    this.setState({isloading: true});
    let bodyFormData = new FormData();
    bodyFormData.append('avatar', {
      uri: this.state.tempavatar.uri,
      type: this.state.tempavatar.type,
      name: this.state.tempavatar.fileName,
    });
    callPost(
      API.UPLOAD_AVATAR,
      bodyFormData,
      (callbackUploadAvatar = res => {
        console.log('callbackUploadAvatar => result', res);
        this.setState({isloading: false});
        if (res) {
          if (res.success) {
            this.onTryUpdate();
          }
        } else {
          showToast('Gagal Ubah Foto Profil');
        }
      }),
    );
  }
  //
  callPickerPhoto() {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response;
        console.log('Source : ', source);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          tempavatar: source,
        });
      }
    });
  }
  getFotoAvatar() {
    if (this.props.user && this.state.tempavatar == null) {
      return {uri: this.props.user.avatar};
    } else if (this.state.tempavatar) {
      return {uri: this.state.tempavatar.uri};
    } else {
      return require('../../assets/images/profilpicture.png');
    }
    /*
     this.props.user.avatar
                ? {uri: this.props.user.avatar}
                : require('../../assets/images/profilpicture.png')
    */
  }
  //
  onCallLogout() {
    this.props.onlogout();
    this.props.navigation.navigate('titlescreen');
    showToast('Berhasil Logout');
  }
  //
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{
          flex: 1,
          backgroundColor: colors.background.COLOR_PRIMARY_1,
        }}>
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {this.addHeader()}
              {this.addFotoProfil()}
              <Forminput
                stylecontainer={profilestyle.containerinput}
                defaultText={this.state.nametxt}
                onChangeText={this.onChangeNameInput}
                styleinput={profilestyle.forminput}
                title={'Nama'}
              />
              <Forminput
                keyboardtype={'email-address'}
                editable={false}
                stylecontainer={profilestyle.containerinput}
                defaultText={this.state.emailtxt}
                onChangeText={this.onChangeEmailInput}
                styleinput={profilestyle.forminput}
                title={'Email'}
              />
              <Forminput
                keyboardtype={'phone-pad'}
                stylecontainer={profilestyle.containerinput}
                defaultText={this.state.phonetxt}
                onChangeText={this.onChangePhoneInput}
                styleinput={profilestyle.forminput}
                title={'No Hp'}
              />
              <Forminput
                stylecontainer={profilestyle.containerinput}
                defaultText={this.state.addresstxt}
                onChangeText={this.onChangeAddressInput}
                styleinput={profilestyle.forminput}
                title={'Alamat'}
              />

              <View
                style={{
                  flex: 1,
                  borderWidth: 0,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <Buttons
                  style={{
                    marginTop: 30,
                    marginHorizontal: 10,
                    width: convertWidth(30),
                    borderRadius: 5,
                    elevation: 1,
                  }}
                  onPressButton={this.onCallLogout.bind(this)}>
                  <View>
                    <Text>Keluar Akun</Text>
                    {this.props.appmode == 1 && (
                      <Text
                        style={{
                          //color: colors.main.COLOR_PRIMARY_1,
                          borderWidth: 0,
                          fontSize: moderateScale(25),
                          fontFamily: fonts.FONT_PRIMARY,
                        }}>
                        {'Keluar Akun'}
                      </Text>
                    )}
                  </View>
                </Buttons>
                {this.addFooter()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
        {this.state.isloading && loadingScreen()}
      </KeyboardAvoidingView>
    );
  }
  //
  addHeader() {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          paddingVertical: 15,
          backgroundColor: colors.background.COLOR_PRIMARY_1,
        }}>
        <Text
          style={{
            marginLeft: moderateScale(20),
            fontSize: moderateScale(21),
          }}>
          {'Profil Saya'}
        </Text>
      </View>
    );
  }
  //AVATAR
  addFotoProfil() {
    return (
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
            source={this.getFotoAvatar()}
            resizeMode={'cover'}
          />
        </View>
        <TouchableHighlight
          onPress={() => this.callPickerPhoto()}
          style={{
            backgroundColor: colors.main.COLOR_PRIMARY_4,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          underlayColor={colors.main.COLOR_PRIMARY_3}>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                color: colors.main.COLOR_PRIMARY_1,
                fontSize: moderateScale(15),
              }}>
              Ubah Foto
            </Text>
            {this.props.appmode == 1 && (
              <Text
                style={{
                  color: colors.main.COLOR_PRIMARY_1,
                  borderWidth: 0,
                  fontSize: moderateScale(25),
                  fontFamily: fonts.FONT_PRIMARY,
                }}>
                {'Ubah Foto'}
              </Text>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  addFooter() {
    return (
      <View
        style={{
          //flex: 0.5,
          width: convertWidth(100),
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Buttons
          style={{width: convertWidth(40)}}
          onPressButton={this.onCallSave.bind(this)}>
          <Text>Simpan</Text>
          {this.props.appmode == 1 && (
            <Text
              style={{
                borderWidth: 0,
                fontSize: moderateScale(25),
                fontFamily: fonts.FONT_PRIMARY,
              }}>
              {'Simpan'}
            </Text>
          )}
        </Buttons>
        <Buttons
          style={{width: convertWidth(40)}}
          onPressButton={this.onCancel.bind(this)}>
          <Text>Batal</Text>
          {this.props.appmode == 1 && (
            <Text
              style={{
                borderWidth: 0,
                fontSize: moderateScale(25),
                fontFamily: fonts.FONT_PRIMARY,
              }}>
              {'Batal'}
            </Text>
          )}
        </Buttons>
      </View>
    );
  }
}
const profilestyle = {
  containerinput: {
    flex: 0,
    width: convertWidth(95),
    height: 55,
    margin: 10,
  },
  forminput: {
    borderWidth: 1,
    paddingLeft: 10,
    height: 50,
    borderRadius: 10,
  },
};
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    user: state.user,
    token: state.token,
    appmode: state.appmode,
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
    onlogout: () =>
      dispatch({
        type: ACTION_TYPE.USER_LOGOUT,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(ScreenProfile);
