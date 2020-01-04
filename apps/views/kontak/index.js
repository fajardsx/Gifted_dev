import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import Buttons from '../../components/Buttons';
import {
  convertWidth,
  callVibrate,
  loadingScreen,
  showToast,
} from './../../configs/utils';
import {styles, colors} from '../../styles';
import {moderateScale} from '../../styles/scaling';
import Forminput from '../../components/Forminput';
import API from '../../services/common/api';
import {callPost} from '../../services';
import Constants from '../../configs/constant';
import Icondelete from '../../assets/images/vector/deletes.svg';
import Iconmarker from '../../assets/images/vector/markerpin.svg';

class KontakDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      ismykontak: false,
      isloading: false,
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
      case 'hapus':
        this.onDeleteKontak();
        break;
    }
  }
  /** API */
  //get kontak
  getAddKontak() {
    console.log('kontak/index.js => getAddKontak() data ');
    //if (!data.latitude || !data.longitude) return;
    this.setState({isloading: true});
    let bodyFormData = new FormData();
    bodyFormData.append('userid', this.state.data.id);
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.ADD_FRIEND,
      bodyFormData,
      (callbackAddKontak = res => {
        this.setState({isloading: false});
        console.log('kontak/index.js => callbackAddKontak() result ', res);
        if (res) {
          if (res.error) {
            //callTo
            //callAlert(Constants.NAME_APPS, `${res.error}`);
            showToast(`${res.error}`);
          } else if (res.success) {
            //this.props.updateuser(res.success);
            //this.setState({datalist: res.success});
            showToast('Berhasil Menambah Teman');
            this.onGoback();
          }
        } else {
          showToast('Gagal Menambah Teman');
        }
      }),
    );
  }
  onDeleteKontak() {
    console.log('kontak/index.js => onDeleteKontak() data ');
    //if (!data.latitude || !data.longitude) return;
    this.setState({isloading: true});
    let bodyFormData = new FormData();
    bodyFormData.append('userid', this.state.data.id);
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.DELETE_FRIEND,
      bodyFormData,
      (callbackDeleteKontak = res => {
        this.setState({isloading: false});
        console.log('kontak/index.js => callbackDeleteKontak() result ', res);
        if (res) {
          if (res.error) {
            //callTo
            //callAlert(Constants.NAME_APPS, `${res.error}`);
            showToast(`${res.error}`);
          } else if (res.success) {
            //this.props.updateuser(res.success);
            //this.setState({datalist: res.success});
            showToast('Berhasil Menghapus Teman');
            this.onGoback();
          }
        } else {
          showToast('Gagal Menghapus Teman');
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
    if (!data.lat || !data.long) {
      return showToast('Tidak ada lokasi terakhir teman');
    }
    callVibrate();
    this.props.updateTarget(data);
    this.props.screenProps.navigation.navigate('tabs');
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
        <View style={{position: 'absolute', bottom: 0}}>
          <Buttons
            style={{width: convertWidth(100), paddingVertical: 10}}
            onPressButton={() => this.onGoback()}>
            <Text>Kembali</Text>
          </Buttons>
        </View>
        {this.state.isloading && loadingScreen()}
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
      <View style={{alignItems: 'center', flex: 1}}>
        <Buttons
          style={{
            margin: 10,
            width: convertWidth(50),
            height: moderateScale(80),
            borderRadius: 10,
          }}
          onPressButton={() => this.onEventClick('lokasi')}>
          <View style={{alignItems: 'center'}}>
            <Iconmarker
              width={moderateScale(25)}
              height={moderateScale(25)}
              fill={colors.main.COLOR_PRIMARY_5}
            />
            <Text>{'Lokasi Kontak'}</Text>
          </View>
        </Buttons>

        <Buttons
          style={{
            margin: 10,
            width: convertWidth(95),
            height: moderateScale(50),
          }}
          onPressButton={() => this.onEventClick('hapus')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icondelete width={moderateScale(25)} height={moderateScale(25)} />
            <Text>Hapus Kontak</Text>
          </View>
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
