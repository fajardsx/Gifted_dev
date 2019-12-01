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

class KontakDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    const dataprops = this.props.screenProps.navigation.getParam('datas', null);
    this.setState({data: dataprops});
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
    const {data} = this.state;
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
                  data
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
              {data ? data.nama : 'tidak ada nama'}
            </Text>
          </View>
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
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    friendtarget: state.currentFriendTarget,
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
