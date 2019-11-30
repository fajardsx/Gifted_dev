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
    };
    context = this;
  }
  componentDidMount() {
    this.props.updateTarget(null);
    this.onCheckPermission();
    //this.setState({permissiongrand: true});
    //this.props.navigation.navigate('titlescreen');
    this.focuslistener = this.props.navigation.addListener('didFocus', () => {
      this.voices.init();
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
  onOpenSetting() {
    callVibrate();
  }
  //
  onCloseModal() {
    this.setState({showSearch: false});
  }
  onProcessDirection() {
    console.log(
      'home/index.js => onProcessDirection ',
      this.props.friendtarget,
    );
    let name = this.props.friendtarget ? this.props.friendtarget.nama : 'teman';
    onCallTTS('Mencari Lokasi ' + name);
    if (this.props.friendtarget) {
      let locTarget =
        this.props.friendtarget.kordinat.longitude +
        ',' +
        this.props.friendtarget.kordinat.latitude;

      if (this.mapbox) {
        console.log(
          'home/index.js => onProcessDirection => locTarget',
          thismapbox,
        );
        this.mapbox.onGetDirection(locTarget);
      }
    }
  }
  onCancelPress() {
    callVibrate();
    this.props.updateTarget(null);
  }
  //COMMAND
  onRenderNavi() {
    if (this.props.friendtarget) {
      return (
        <View
          style={{
            bottom: '5%',
            width: convertWidth(100),
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Buttons
            onPressButton={this.onCancelPress.bind(this)}
            style={{
              backgroundColor: '#f0f0f0',
              width: convertWidth(40),
              height: convertHeight(15),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{borderWidth: 0}}>{'Ulang'}</Text>
            </View>
          </Buttons>
          <Buttons
            //  onPressButton={this.onStartRecognition.bind(this)}
            style={{
              backgroundColor: '#f0f0f0',
              width: convertWidth(40),
              height: convertHeight(15),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{borderWidth: 0}}>{'Mulai'}</Text>
            </View>
          </Buttons>
        </View>
      );
    }
  }

  //RENDER
  render() {
    const {permissiongrand, showSearch, valuesearch, searchEnable} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {/* {permissiongrand == true && <MapsBoxComponent />}
         */}
        {permissiongrand == true && (
          <MapsBoxComponent
            //ref={c => (this.mapbox = c)}
            target={this.props.friendtarget}
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
        {this.onRenderNavi()}
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
