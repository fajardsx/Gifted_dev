import React, {Component} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import {styles, colors, images} from '../../styles';
import VoicesComponent from '../../components/Voices';
import MapsComponent from '../../components/Maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import MapsBoxComponent from '../../components/Mapsbox';
import {moderateScale} from '../../styles/scaling';
import Iconsetting from '../../assets/images/vector/setting.svg';
import IconButa from '../../assets/images/vector/iconbuta.svg';
import IconTuli from '../../assets/images/vector/icontuli.svg';
import {
  callVibrate,
  findCommad,
  onCallTTS,
  convertWidth,
  convertHeight,
} from '../../configs/utils';
import ModalSearch from '../appmodal/SearchModal';
import Constants from '../../configs/constant';
import Buttons from '../../components/Buttons';
import SearchResulthScreen from './searchresultscreen';
import {withNavigationFocus} from 'react-navigation';
import {callPost} from '../../services';
import API from '../../services/common/api';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import ChatHandsign from './ChatHandsign';
const iconSize = moderateScale(30);

let context = null;
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissiongrand: false,
      showSearch: false,
      valuesearch: '',
      searchEnable: true,
      resultSearch: false,
      isnavi: false,
      index: 0,
      routes: [
        {key: 'first', title: 'Peta'},
        {key: 'second', title: 'Handsign'},
      ],
    };
    context = this;
    //this.mapboxs = React.createRef();
  }
  componentDidMount() {
    this.props.updateTarget(null);
    this.onCheckPermission();
    this.getProfile();
    this.focuslistener = this.props.navigation.addListener('didFocus', () => {
      if (this.voices) {
        this.voices.init();
      }
    });
  }
  componentWillUnmount() {
    console.log('home/index.js => Destroy');
  }
  //HandleIndexChange
  handleIndexChange = index => {
    this.setState({index});
  };
  //PROCESS NAVI
  onPressCell(item) {
    callVibrate();
    console.log('home/index.js => onPressCell ', item);
    this.setState({showSearch: false});
  }
  //EVENT
  onCheckPermission() {
    console.log('home/index.js => onCheckPermission ');
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
              //this.onCheckPermission();
            });
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            this.setState({permissiongrand: true});
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => console.log('onCheckPermission() ', error));
  }
  //Callback
  onCallbackResult(data) {
    let dataSplit = data.split(' ');
    console.log('home/index.js => oncallbackResult ', dataSplit);

    dataSplit.map((res, index) => {
      console.log('home/index.js => oncallbackResult ', findCommad(res));
      if (findCommad(res) == Constants.COMMAND_CARI) {
        context.props.navigation.navigate('resultsearchscreen', {
          valuesearch: dataSplit[index + 1] ? dataSplit[index + 1] : '',
          functOnProcess: () => this.onProcessDirection(),
        });
      }
    });
  }
  //Setting
  //
  onCloseModal() {
    this.setState({showSearch: false});
  }
  onProcessDirection() {
    let name = this.props.friendtarget ? this.props.friendtarget.name : 'teman';
    onCallTTS('Mencari Lokasi ' + name);
    console.log(
      'home/index.js => onProcessDirection => friendtarget',
      this.props.friendtarget,
    );
    // if (this.props.friendtarget) {
    //   let locTarget =
    //     this.props.friendtarget.long + ',' + this.props.friendtarget.lat;

    //   if (this.mapbox) {
    //     //this.mapbox.onGetDirection(locTarget);
    //   }
    // } else {
    //   //return this.onProcessDirection();
    // }
  }
  onCancelPress() {
    callVibrate();
    this.setState({isnavi: false});
    this.props.updateTarget(null);
  }
  onStartPress() {
    callVibrate();
    console.log('home/index.js => onStartPress => mapbox', this.refs.mapboxs);
    // this.mapboxs.onStart();
  }
  onOpenSetting() {
    callVibrate();
    onCallTTS('Membuka Pengaturan');
    this.props.navigation.navigate('settingscreen');
  }
  /** API */
  //profile
  getProfile() {
    console.log('home/index.js => getProfile() data ');
    let bodyFormData = new FormData();
    bodyFormData.append('lat', 0);
    bodyFormData.append('long', 0);
    //if (!data.latitude || !data.longitude) return;
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(API.GET_PROFILE, bodyFormData, this.callbackProfile.bind(this));
  }
  callbackProfile(res) {
    console.log('home/index.js => callbackProfile() result ', res);
    if (res) {
      if (res.error) {
        //callTo
        callAlert(
          Constants.NAME_APPS,
          `${res.error}, Gagal Menghubungi Server`,
        );
      } else if (res.success) {
        this.props.updateuser(res.success);
        this.getKontak();
      }
    }
  }
  //get kontak
  getKontak() {
    console.log('home/index.js => getKontak() data ');
    //if (!data.latitude || !data.longitude) return;

    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.MY_CONTACT,
      null,
      (callbackgetkontak = res => {
        console.log('home/index.js => callbackgetkontak() result ', res);
        if (res) {
          if (res.error) {
            //callTo
            onCallTTS(res.error);
            //callAlert(Constants.NAME_APPS, `${res.error}`);
          } else if (res.success) {
            this.props.updateKontakList(res.success);
            //this.setState({datalist: res.success});
          }
        }
      }),
    );
  }
  //change mode
  onChangeMode() {
    this.props.updatemode(this.props.appmode == 0 ? 1 : 0);
  }
  //update position
  postUpdatePosition(data) {
    console.log('home/index.js => postUpdatePosition() data ', data);
    let bodyFormData = new FormData();
    bodyFormData.append('lat', data.latitude);
    bodyFormData.append('long', data.longitude);
    if (!data.latitude || !data.longitude) return;
    let tempdata = Object.assign([], this.props.user);
    tempdata.lat = data.latitude;
    tempdata.long = data.longitude;
    this.props.updateuser(tempdata);
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.UPDATE_LOCATION,
      bodyFormData,
      this.callbackUpdatePosition.bind(this),
    );
  }
  callbackUpdatePosition(res) {
    console.log('home/index.js => callbackUpdatePosition() result ', res);
    if (res) {
      if (res.error) {
        //callTo
        callAlert(Constants.NAME_APPS, `${res.error}, Gagal Update`);
      } else if (res.success) {
      }
    }
  }
  //
  //=============================RENDER==========================================
  render() {
    const {permissiongrand, searchEnable, index} = this.state;
    return (
      <View style={styles.container}>
        {this.headerHome()}
        <TabView
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: colors.tabsstyle.COLOR_PRIMARY_1,
              }}
              style={{backgroundColor: colors.tabsstyle.COLOR_PRIMARY_3}}
              renderLabel={({route, focused, color}) => (
                <Text
                  style={{
                    fontSize: moderateScale(15),
                    color:
                      focused == true
                        ? colors.tabsstyle.COLOR_PRIMARY_1
                        : colors.tabsstyle.COLOR_PRIMARY_2,
                    margin: 8,
                  }}>
                  {route.title}
                </Text>
              )}
            />
          )}
          navigationState={this.state}
          renderScene={SceneMap({first: this.sceneMap, second: this.sceneChat})}
          onIndexChange={this.handleIndexChange}
          initialLayout={{width: convertWidth(100), height: 200}}
        />
        {searchEnable && this.props.friendtarget == null && index == 0 && (
          <VoicesComponent
            ref={c => (this.voices = c)}
            {...this.props}
            onCallback={this.onCallbackResult.bind(this)}
            onProcess={this.onProcessDirection.bind(this)}
            style={{position: 'absolute', left: convertWidth(30)}}
          />
        )}
      </View>
    );
  }
  headerHome() {
    return (
      <View
        style={[
          styles.headerstyle,
          {borderBottomWidth: 0.5, borderColor: colors.main.COLOR_PRIMARY_3},
        ]}>
        {this.props.user && (
          <View
            style={{
              width: convertWidth(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: iconSize + 10,
                width: iconSize + 10,
                borderRadius: iconSize,
                backgroundColor: colors.background.COLOR_PRIMARY_1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.navigate('profilescreen')}>
              <Image
                style={[
                  styles.cellPhotosize,
                  {borderRadius: moderateScale(100), overflow: 'hidden'},
                ]}
                source={
                  this.props.user.avatar
                    ? {uri: this.props.user.avatar}
                    : images.defaultavatar
                }
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            width: convertWidth(50),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={[styles.logoPhotosize]}
            source={images.logo}
            resizeMode={'cover'}
          />
        </View>
        <View
          style={{
            width: convertWidth(30),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.switchMode()}
        </View>
      </View>
    );
  }
  switchMode() {
    return (
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => this.onChangeMode()}
          style={{
            flexDirection: 'row',
            width: convertWidth(25),
            borderWidth: 0.5,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background.COLOR_PRIMARY_2,
            borderRadius: iconSize,
          }}>
          <View
            style={{
              height: iconSize + 10,
              width: iconSize + 10,
              borderRadius: iconSize,
              backgroundColor:
                this.props.appmode == 0
                  ? colors.background.COLOR_PRIMARY_1
                  : colors.background.COLOR_PRIMARY_2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconButa height={iconSize} width={iconSize} />
          </View>
          <View
            style={{
              height: iconSize + 10,
              width: iconSize + 10,
              borderRadius: iconSize,
              backgroundColor:
                this.props.appmode == 1
                  ? colors.background.COLOR_PRIMARY_1
                  : colors.background.COLOR_PRIMARY_2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IconTuli height={iconSize} width={iconSize} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  sceneMap = () => (
    <MapsComponent
      ref={this.mapboxs}
      target={this.props.friendtarget}
      onCancel={this.onCancelPress.bind(this)}
      isnavi={this.state.isnavi}
      onUpdate={this.postUpdatePosition.bind(this)}
    />
  );
  sceneChat = () => (
    <ChatHandsign
      onCancel={this.onCancelPress.bind(this)}
      isnavi={this.state.isnavi}
      onUpdate={this.postUpdatePosition.bind(this)}
    />
  );
  //modal search
  modalSearch() {}
}
const FirstRoute = () => (
  <View style={[{flex: 1, backgroundColor: '#ff4081'}]} />
);

const SecondRoute = () => (
  <View style={[{flex: 1, backgroundColor: '#673ab7'}]} />
);
{
  /* {permissiongrand == true && (
          <MapsBoxComponent
            ref={this.mapboxs}
            target={this.props.friendtarget}
            onCancel={this.onCancelPress.bind(this)}
            isnavi={isnavi}
            onUpdate={this.postUpdatePosition.bind(this)}
          />
        )} */
}

function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    token: state.token,
    friendtarget: state.currentFriendTarget,
    user: state.user,
    appmode: state.appmode,
  };
}
function dispatchToProps(dispatch) {
  return {
    updateIsFirst: data =>
      dispatch({
        type: ACTION_TYPE.CHANGE_STATUS_FIRSTTIME,
        value: data,
      }),
    updateTarget: data =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TARGET,
        value: data,
      }),
    updateKontakList: data =>
      dispatch({
        type: ACTION_TYPE.UPDATE_KONTAKLIST,
        value: data,
      }),
    updateuser: user =>
      dispatch({
        type: ACTION_TYPE.UPDATE_USER,
        value: user,
      }),
    updatemode: data =>
      dispatch({
        type: ACTION_TYPE.UPDATE_MODE,
        value: data,
      }),
  };
}
export default connect(
  mapStateToProps,
  dispatchToProps,
)(withNavigationFocus(HomeScreen));
