import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import {styles} from '../../styles';
import Buttons from '../../components/Buttons';
import {moderateScale} from '../../styles/scaling';
import {convertWidth, callAlert} from '../../configs/utils';
import Forminput from '../../components/Forminput';
import {callVibrate} from './../../configs/utils';
import {postLogin, callPost} from '../../services';
import API from '../../services/common/api';
import Constants from '../../configs/constant';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SafeAreaView from 'react-native-safe-area-view';

class Screenlogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailtxt: '',
      passwordtxt: '',
    };
  }
  onChangeEmailInput = text => {
    this.setState({emailtxt: text});
  };
  onChangePasswordInput = text => {
    this.setState({passwordtxt: text});
  };
  //API
  onTryLogin() {
    // console.log('screenlogin', this.state.emailtxt);
    // console.log('screenlogin', this.state.passwordtxt);
    callVibrate();
    if (Constants.DEV_MODE) {
      return this.props.navigation.navigate('inappscreen');
    }

    let bodyFormData = new FormData();
    bodyFormData.append('email', this.state.emailtxt);
    bodyFormData.append('password', this.state.passwordtxt);
    callPost(API.LOGIN, bodyFormData, this.callbacklogin.bind(this));
  }
  callbacklogin(res) {
    console.log(res);
    if (res) {
      if (res.error) {
        //callTo
        callAlert(Constants.NAME_APPS, `${res.error}, Gagal Masuk`);
      } else if (res.success) {
        this.props.updatetoken(res.success.token);
        this.props.navigation.navigate('inappscreen');
      }
    }
  }
  //
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: convertWidth(50), height: moderateScale(200)}}
            source={require('../../assets/images/gifted.jpg')}
            resizeMode={'contain'}
          />
          <Text
            style={{
              fontSize: moderateScale(15),
              //paddingBottom: moderateScale(50),
            }}>
            Login
          </Text>
          <Forminput
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.emailtxt}
            onChangeText={this.onChangeEmailInput}
            styleinput={{borderBottomWidth: 1}}
            title={'Email'}
          />
          <Forminput
            securetxt={true}
            stylecontainer={{flex: 0, width: convertWidth(95), margin: 10}}
            defaultText={this.state.epasswordtxtailtxt}
            onChangeText={this.onChangePasswordInput}
            styleinput={{borderBottomWidth: 1}}
            title={'Password'}
          />
          <TouchableOpacity>
            <Text>Lupa Password</Text>
          </TouchableOpacity>
          <Buttons
            style={{
              marginTop: moderateScale(50),
              margin: 10,
              width: convertWidth(95),
            }}
            onPressButton={this.onTryLogin.bind(this)}>
            <Text>Submit</Text>
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
export default connect(mapStateToProps, dispatchToProps)(Screenlogin);
