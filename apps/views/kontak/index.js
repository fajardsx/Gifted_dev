import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import Buttons from '../../components/Buttons';
import {convertWidth, callVibrate} from './../../configs/utils';
import {styles} from '../../styles';
import {moderateScale} from '../../styles/scaling';
import Forminput from '../../components/Forminput';
import API from '../../services/common/api';
import {callPost} from '../../services';
import Constants from '../../configs/constant';
class KontakDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      ismykontak: false,
    };
  }
  componentDidMount() {
    const dataprops = this.props.screenProps.navigation.getParam('datas', null);
    const ismykontak = this.props.screenProps.navigation.getParam(
      'ismykontak',
      false,
    );
    console.log(dataprops);
    this.setState({data: dataprops, ismykontak});
  }
  //
  onEventClick(id) {
    callVibrate();
    switch (id) {
      case 'lokasi':
        this.openLokasi();
        break;
      case 'ubah':
        break;
      case 'hapus':
        //this.props.navigation.navigate('carikontakscreen');
        break;
    }
  }
  /** API */
  //get kontak
  getAddKontak() {
    console.log('kontak/index.js => getAddKontak() data ');
    //if (!data.latitude || !data.longitude) return;
    let bodyFormData = new FormData();
    bodyFormData.append('userid', this.state.data.id);
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.ADD_FRIEND,
      bodyFormData,
      (callbackAddKontak = res => {
        console.log('kontak/index.js => callbackAddKontak() result ', res);
        if (res) {
          if (res.error) {
            //callTo
            //callAlert(Constants.NAME_APPS, `${res.error}`);
          } else if (res.success) {
            //this.props.updateuser(res.success);
            //this.setState({datalist: res.success});
            this.onGoback();
          }
        }
      }),
    );
  }
  onGoback() {
    callVibrate();
    this.props.screenProps.navigation.goBack();
  }
  openLokasi() {
    const {data} = this.state;

    if (!data) {
      return;
    }
  }
  //
  render() {
    const {data, ismykontak} = this.state;
    if (data == null) return null;
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
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
            {'Detail Kontak'}
          </Text>
        </View>

        <View style={[styles.container, {alignItems: 'center'}]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <View
              style={[
                styles.profilsize,
                {borderRadius: moderateScale(100), overflow: 'hidden'},
              ]}>
              <Image
                style={styles.profilsize}
                source={
                  data.avatar
                    ? {uri: data.avatar}
                    : require('../../assets/images/profilpicture.png')
                }
                resizeMode={'cover'}
              />
            </View>
            <Text
              style={{
                marginLeft: moderateScale(20),
                width: convertWidth(25),
                //textAlign: 'center',
                fontSize: moderateScale(21),
              }}>
              {data ? data.name : 'tidak ada nama'}
            </Text>
          </View>
          {ismykontak == true && this.btnTeman()}
          {ismykontak == false && this.tambahTeman()}
        </View>
        <View style={{flex: 0.5}}>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.onGoback()}>
            <Text>Kembali</Text>
          </Buttons>
        </View>
      </View>
    );
  }
  tambahTeman() {
    return (
      <Buttons
        style={{margin: 10, width: convertWidth(95)}}
        onPressButton={this.getAddKontak.bind(this)}>
        <Text>Tambah Teman</Text>
      </Buttons>
    );
  }
  btnTeman() {
    return (
      <View>
        <Buttons
          style={{
            margin: 10,
            width: convertWidth(50),
            height: moderateScale(80),
          }}
          onPressButton={() => this.onEventClick('lokasi')}>
          <Text>{'Lokasi\nKontak'}</Text>
        </Buttons>
        <Buttons
          style={{margin: 10, width: convertWidth(95)}}
          onPressButton={() => this.onEventClick('ubah')}>
          <Text>Ubah Kontak</Text>
        </Buttons>
        <Buttons
          style={{margin: 10, width: convertWidth(95)}}
          onPressButton={() => this.onEventClick('hapus')}>
          <Text>Hapus Kontak</Text>
        </Buttons>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    friendtarget: state.currentFriendTarget,
    token: state.token,
  };
}
function dispatchToProps(dispatch) {
  return {
    updateIsFirst: isfirst =>
      dispatch({
        type: ACTION_TYPE.CHANGE_STATUS_FIRSTTIME,
        value: isfirst,
      }),
    updateTarget: isfirst =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TARGET,
        value: isfirst,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(KontakDetailScreen);
