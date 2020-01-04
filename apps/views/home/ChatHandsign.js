import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {styles, fonts, colors} from '../../styles';
import Modal from 'react-native-modal';

//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import MapsBoxComponent from '../../components/Mapsbox';
import {moderateScale} from '../../styles/scaling';
import IconSearch from '../../assets/images/vector/search-solid.svg';
import IconMic from '../../assets/images/vector/microphone.svg';
import IconEnter from '../../assets/images/vector/Enter.svg';
import {
  callVibrate,
  onCallTTS,
  findCommad,
  callAlert,
} from '../../configs/utils';
import {convertWidth} from './../../configs/utils';
import Forminput from '../../components/Forminput';
import VoicesComponent from '../../components/Voices';
import Constants from '../../configs/constant';
import API from '../../services/common/api';
import {callPost} from '../../services';
const iconSize = moderateScale(40);
class ChatScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissiongrand: false,
      searchtxt: '',
      datalist: [
        {result: 'hallo'},
        {result: 'hallo'},
        {result: 'hallo'},
        {result: 'hallo'},
        {result: 'hallo'},
      ],
    };
  }
  componentDidMount() {}
  componentWillUnmount() {
    console.log('SearchResulthScreen.js => Destroy ');
  }
  //   static getDerivedStateFromProps(props, state) {
  //     if (props.valueSearch !== state.searchtxt) {
  //       return {
  //         searchtxt: props.valueSearch,
  //       };
  //     }
  //     return state;
  //   }
  //Callback
  static getDerivedStateFromProps(props, state) {
    if (props.datalist != state.datalist) {
      console.log(
        'hChathansign.js => getDerivedStateFromProps ',
        props.datalist,
      );
      return {
        datalist: props.datalist,
      };
    }
    return null;
  }
  onCallbackResult(data) {
    this.setState({datalist: []}, () => {
      //let dataSplit = data.split(' ');
      console.log('hChathansign.js => oncallbackResult ', data);
      let tmpList = Object.assign([], this.state.datalist);
      tmpList.push({result: data});
      this.setState({datalist: tmpList});
    });
  }
  /** API */
  //get kontak
  getFindKontak() {
    console.log('home/index.js => getKontak() data ');
    //if (!data.latitude || !data.longitude) return;
    let bodyFormData = new FormData();
    bodyFormData.append('name', this.state.searchtxt);
    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.FIND_FRIEND,
      bodyFormData,
      (callbackFindkontak = res => {
        console.log('home/index.js => callbackFindkontak() result ', res);
        if (res) {
          if (res.error) {
            //callTo
            //callAlert(Constants.NAME_APPS, `${res.error}`);
            this.setState({datalist: []});
            onCallTTS(res.error);
          } else if (res.success) {
            //this.props.updateuser(res.success);
            this.setState({datalist: res.success});
          }
        }
      }),
    );
  }
  //Setting
  onOpenSetting() {
    callVibrate();
  }
  onChangeInput = text => {
    this.setState({searchtxt: text});
  };
  //FILTER
  processSearch() {
    const {searchtxt, data} = this.state;
    this.getFindKontak();
  }
  //
  onSelectFriend(item) {
    console.log('processSearch() => onSelectFriend', item);
  }
  //RENDER
  render() {
    //const {permissiongrand} = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{
          flex: 1,
          backgroundColor: colors.background.COLOR_PRIMARY_1,
        }}>
        <SafeAreaView style={[styles.container, {alignItems: 'center'}]}>
          <View
            style={{
              flex: 0.6,
              paddingVertical: 10,
              backgroundColor: '#fff',
              alignItems: 'center',
            }}>
            {
              <FlatList
                ref={res => (this.chat = res)}
                style={{
                  height: moderateScale(200),
                  width: convertWidth(100),
                  //borderWidth: 1,
                }}
                onContentSizeChange={() => {
                  this.chat.scrollToEnd({animated: true});
                }}
                extraData={this.state}
                data={this.state.datalist}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                renderItem={this.celllist}
              />
            }
          </View>
          {this.addInput()}
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  addInput() {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#dedcd7',
          borderRadius: 10,
          backgroundColor: '#ededed',
          width: convertWidth(95),
          height: convertWidth(10),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextInput
          onChangeText={this.onChangeInput}
          defaultValue={this.state.searchtxt}
          onSubmitEditing={e => {
            console.log(
              'hChathansign.js => onSubmitEditing ',
              e.nativeEvent.text,
            );
            this.setState({searchtxt: ''});
            this.props.onUpdateList(e.nativeEvent.text);
          }}
          style={[
            {
              //borderWidth: 1,
              marginLeft: 10,
              color: '#000',
              fontSize: moderateScale(15),
              width: convertWidth(85),
              height: moderateScale(40),
            },
          ]}
          textAlignVertical={'bottom'}
          placeholder={'Masukan kata'}
        />
        <TouchableOpacity>
          <IconEnter height={moderateScale(15)} width={moderateScale(15)} />
        </TouchableOpacity>
      </View>
    );
  }
  celllist = ({item, index}) => (
    <TouchableOpacity
      onPress={() => this.onSelectFriend(item)}
      style={{
        borderWidth: 1,
        margin: 10,
        width: convertWidth(95),
        minHeight: moderateScale(40),
        //flexDirection: 'row',
        //alignItems: 'center',
        borderRadius: 5,
        marginBottom: 5,
        paddingVertical: moderateScale(10),
      }}>
      <Text style={{marginLeft: 10, fontSize: 20}}>
        {item ? item.result : ''}
      </Text>
      <Text
        style={{marginLeft: 10, fontSize: 50, fontFamily: fonts.FONT_PRIMARY}}>
        {item ? item.result : ''}
      </Text>
    </TouchableOpacity>
  );
}

function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
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
    updateTarget: values =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TARGET,
        value: values,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(ChatScreen);
