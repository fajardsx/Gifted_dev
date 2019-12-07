import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import {styles} from '../../styles';
import Modal from 'react-native-modal';

//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
//
import MapsBoxComponent from '../../components/Mapsbox';
import {moderateScale} from '../../styles/scaling';
import IconSearch from '../../assets/images/vector/search-solid.svg';
import IconMic from '../../assets/images/vector/microphone.svg';
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
class CariKontakScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissiongrand: false,
      searchtxt: '',
      datalist: [],
    };
  }
  componentDidMount() {
    let findTxt = this.props.navigation.getParam('valuesearch', '');

    console.log('SearchResulthScreen.js => findTxt ', findTxt);
    this.props.updateTarget(null);
    this.setState({searchtxt: findTxt}, () => {
      this.processSearch();
    });
  }
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
  onCallbackResult(data) {
    let dataSplit = data.split(' ');
    console.log('home/index.js => oncallbackResult ', dataSplit);
    dataSplit.map((res, index) => {
      console.log('home/index.js => oncallbackResult ', findCommad(res));
      if (findCommad(res) == Constants.COMMAND_CARI) {
        this.setState(
          {
            searchtxt: dataSplit[index + 1] ? dataSplit[index + 1] : '',
          },
          () => {
            //this.processSearch();
          },
        );
      }
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
    this.setState({searchtxt: text}, () => {
      if (this.state.searchtxt.length >= 2) {
        this.processSearch();
      }
    });
  };
  //FILTER
  processSearch() {
    const {searchtxt, data} = this.state;
    this.getFindKontak();
    // console.log('data', this.props.friendlist);
    // if (searchtxt.length < 1) {
    //   return this.setState({
    //     datalist: [],
    //   });
    // }
    // let listname = '';
    // let resultSearch = this.props.friendlist.filter(res => {
    //   let resData = '';
    //   // let keyCity = res.city_name ? res.city_name.toUpperCase() : '';
    //   let keyName = res.nama ? res.nama.toUpperCase() : '';
    //   console.log('processSearch() => res', res);
    //   console.log('processSearch() => searchtxt', searchtxt);
    //   resData = `${keyName} `;
    //   listname += resData;
    //   const textData = searchtxt.toUpperCase();
    //   return resData.indexOf(textData) > -1;
    // });
    // console.log('processSearch() => data', resultSearch);
    // this.setState(
    //   {
    //     datalist: resultSearch,
    //   },
    //   () => {
    //     if (resultSearch.length < 1) {
    //       onCallTTS(`Lokasi ${this.state.searchtxt} tidak ditemukan`);
    //     } else if (resultSearch.length == 1) {
    //       onCallTTS(`Lokasi ${listname[0]} ditemukan`);
    //     } else if (resultSearch.length > 1) {
    //       onCallTTS(`pencarian ditemukan dengan nama ${listname}`);
    //     }
    //   },
    // );
    //that.filterLocation(resultSearch)
  }
  //
  onSelectFriend(item) {
    console.log('processSearch() => onSelectFriend', item);
    this.props.navigation.navigate('detailkontakscreen', {
      datas: item,
      ismykontak: false,
    });
    //this.props.updateTarget(item);
    //this.props.navigation.state.params.functOnProcess();
    //this.props.navigation.goBack();
  }
  //RENDER
  render() {
    //const {permissiongrand} = this.state;
    return (
      <SafeAreaView style={styles.container}>
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
            {'Cari Teman'}
          </Text>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
          <View style={{paddingVertical: 10}} />
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#dedcd7',
              borderRadius: 25,
              //backgroundColor: '#ededed',
              width: convertWidth(80),
              height: convertWidth(10),
              //justifyContent: 'center',
              alignItems: 'center',
              //paddingTop: '10%',
            }}>
            <TextInput
              onChangeText={this.onChangeInput}
              defaultValue={this.state.searchtxt}
              style={[
                {
                  //borderWidth: 1,
                  marginLeft: 10,
                  color: '#000',
                  fontSize: moderateScale(15),
                  width: convertWidth(65),
                  height: moderateScale(40),
                },
              ]}
              textAlignVertical={'bottom'}
              placeholder={'Cari'}
            />
            <IconSearch height={moderateScale(15)} width={moderateScale(15)} />
          </View>
          {this.state.datalist.length > 0 && (
            <FlatList
              style={{paddingVertical: 10}}
              extraData={this.state}
              data={this.state.datalist}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={this.celllist}
            />
          )}
          {this.state.datalist.length == 0 && (
            <View
              style={{height: moderateScale(300), justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: moderateScale(15),
                }}>{`Kontak ${this.state.searchtxt} tidak ditemukan`}</Text>
            </View>
          )}

          <VoicesComponent
            onCallback={this.onCallbackResult.bind(this)}
            label={'Cari\nTeman'}
            style={{
              position: 'absolute',
              bottom: moderateScale(30),
              top: null,
              left: moderateScale(90),
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
  celllist = ({item, index}) => (
    <TouchableOpacity
      onPress={() => this.onSelectFriend(item)}
      style={{
        borderWidth: 1,
        width: convertWidth(90),
        minHeight: moderateScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 5,
        paddingVertical: moderateScale(10),
      }}>
      <View style={[styles.cellprofilsize, {marginHorizontal: 10}]}>
        <Image
          style={[
            styles.cellprofilsize,
            {borderRadius: moderateScale(100), overflow: 'hidden'},
          ]}
          source={
            item.avatar
              ? {uri: item.avatar}
              : require('../../assets/images/profilpicture.png')
          }
          resizeMode={'cover'}
        />
      </View>
      <Text>{item.name}</Text>
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
export default connect(mapStateToProps, dispatchToProps)(CariKontakScreen);
