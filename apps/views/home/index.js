import React, {PureComponent} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
import VoicesComponent from '../../components/Voices';
import MapsComponent from '../../components/Maps';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import MapsBoxComponent from '../../components/Mapsbox';
import {moderateScale} from '../../styles/scaling';
import Iconsetting from '../../assets/images/vector/setting.svg';
import {callVibrate, findCommad} from '../../configs/utils';
import ModalSearch from '../appmodal/SearchModal';
import Constants from '../../configs/constant';
const iconSize = moderateScale(40);
let context = null;
class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissiongrand: false,
      showSearch: false,
      valuesearch: '',
    };
    context = this;
  }
  componentDidMount() {
    this.onCheckPermission();
    //this.setState({permissiongrand: true});
    //this.props.navigation.navigate('titlescreen');
  }
  //EVENT
  onCheckPermission() {
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
        context.setState({
          showSearch: true,
          valuesearch: dataSplit[index + 1] ? dataSplit[index + 1] : '',
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
  //RENDER
  render() {
    const {permissiongrand, showSearch, valuesearch} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {/* {permissiongrand == true && <MapsBoxComponent />}
         */}
        {permissiongrand == true && <MapsComponent />}

        <VoicesComponent
          onCallback={this.onCallbackResult.bind(this)}
          style={{position: 'absolute'}}
        />
        <View style={{position: 'absolute', top: '3%', left: '5%'}}>
          <TouchableOpacity onPress={() => this.onOpenSetting()}>
            <Iconsetting height={iconSize} width={iconSize} />
          </TouchableOpacity>
        </View>
        <ModalSearch
          isShow={showSearch}
          valueSearch={valuesearch}
          onClose={this.onCloseModal.bind(this)}
        />
      </SafeAreaView>
    );
  }
  //modal search
  modalSearch() {}
}

function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
  };
}
function dispatchToProps(dispatch) {
  return {
    updateIsFirst: isfirst =>
      dispatch({
        type: ACTION_TYPE.CHANGE_STATUS_FIRSTTIME,
        value: isfirst,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(HomeScreen);
