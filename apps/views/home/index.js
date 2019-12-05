import React, {Component} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
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
const iconSize = moderateScale(40);

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
    };
    context = this;
    //this.mapboxs = React.createRef();
  }
  componentDidMount() {
    this.props.updateTarget(null);
    this.onCheckPermission();
    //this.setState({permissiongrand: true});
    //this.props.navigation.navigate('titlescreen');
    this.focuslistener = this.props.navigation.addListener('didFocus', () => {
      if (this.voices) {
        this.voices.init();
      }
    });
  }
  componentWillUnmount() {
    console.log('home/index.js => Destroy');
  }
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
              this.onCheckPermission();
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
      .catch(error => console.log(error));
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
    let name = this.props.friendtarget ? this.props.friendtarget.nama : 'teman';
    onCallTTS('Mencari Lokasi ' + name);
    console.log(
      'home/index.js => onProcessDirection => friendtarget',
      this.props.friendtarget,
    );
    if (this.props.friendtarget) {
      let locTarget =
        this.props.friendtarget.kordinat.longitude +
        ',' +
        this.props.friendtarget.kordinat.latitude;

      if (this.mapbox) {
        //this.mapbox.onGetDirection(locTarget);
      }
    } else {
      //return this.onProcessDirection();
    }
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
  postUpdatePosition(data) {
    console.log('home/index.js => postUpdatePosition() data ', data);
    let bodyFormData = new FormData();
    bodyFormData.append('lat', data.latitude);
    bodyFormData.append('long', data.longitude);
    if (!data.latitude || !data.longitude) return;
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
    const {permissiongrand, searchEnable, isnavi} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {/* {permissiongrand == true && <MapsBoxComponent />}
         */}
        {/* {permissiongrand == true && (
          <MapsBoxComponent
            ref={this.mapboxs}
            target={this.props.friendtarget}
            onCancel={this.onCancelPress.bind(this)}
            isnavi={isnavi}
            onUpdate={this.postUpdatePosition.bind(this)}
          />
        )} */}
        {permissiongrand == true && (
          <MapsComponent
            ref={this.mapboxs}
            target={this.props.friendtarget}
            onCancel={this.onCancelPress.bind(this)}
            isnavi={isnavi}
            onUpdate={this.postUpdatePosition.bind(this)}
          />
        )}
        {searchEnable && this.props.friendtarget == null && (
          <VoicesComponent
            ref={c => (this.voices = c)}
            {...this.props}
            onCallback={this.onCallbackResult.bind(this)}
            onProcess={this.onProcessDirection.bind(this)}
            style={{position: 'absolute'}}
          />
        )}

        <View style={{position: 'absolute', top: '3%', left: '5%'}}>
          <TouchableOpacity onPress={() => this.onOpenSetting()}>
            <Iconsetting height={iconSize} width={iconSize} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  //modal search
  modalSearch() {}
}

function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    token: state.token,
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
export default connect(
  mapStateToProps,
  dispatchToProps,
)(withNavigationFocus(HomeScreen));
