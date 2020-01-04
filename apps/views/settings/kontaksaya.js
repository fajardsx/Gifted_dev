import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import Buttons from '../../components/Buttons';
import {convertWidth, callAlert, onCallTTS} from './../../configs/utils';
import {styles, fonts} from '../../styles';
import {moderateScale} from '../../styles/scaling';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
import API from '../../services/common/api';
import {callPost} from '../../services';
import Constants from '../../configs/constant';
import {withNavigationFocus} from 'react-navigation';
import IconSearch from '../../assets/images/vector/search-solid.svg';
class KontakScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datalist: [],
      searchtxt: '',
    };
  }
  componentDidMount() {
    this.focuslistener = this.props.navigation.addListener('didFocus', () => {
      this.getKontak();
      console.log(
        'KontakScreen.js => didFocus target ',
        this.props.friendtarget,
      );
      if (this.props.friendtarget) {
        this.props.navigation.navigate('Home');
      }
    });
  }
  /** API */
  //get kontak
  getKontak() {
    console.log('KontakScreen.js => getKontak() data ');
    //if (!data.latitude || !data.longitude) return;

    Constants.HEADER_POST.Authorization = 'Bearer ' + this.props.token;
    callPost(
      API.MY_CONTACT,
      null,
      (callbackgetkontak = res => {
        console.log('KontakScreen.js => callbackgetkontak() result ', res);
        if (res) {
          if (res.error) {
            //callTo
            onCallTTS(res.error);
            //callAlert(Constants.NAME_APPS, `${res.error}`);
          } else if (res.success) {
            this.props.updateFriendlist(res.success);
            this.setState({datalist: res.success}, () => {
              this.processSearch();
            });
          }
        }
      }),
    );
  }
  onSelectFriend(item) {
    this.props.navigation.navigate('detailkontakscreen', {
      datas: item,
      ismykontak: true,
    });
  }
  onChangeInput = text => {
    this.setState({searchtxt: text}, () => {
      //if (text.length >= 3) {
      this.processSearch();
      // }
    });
  };
  //FILTER
  processSearch() {
    const {searchtxt, data} = this.state;
    console.log('data', this.props.friendlist);
    let listname = '';
    let resultSearch = this.props.friendlist.filter(res => {
      let resData = '';

      // let keyCity = res.city_name ? res.city_name.toUpperCase() : '';
      let keyName = res ? res.name.toUpperCase() : '';
      console.log('processSearch() => res', res);
      console.log('processSearch() => searchtxt', searchtxt);
      resData = `${keyName} `;
      listname += resData;
      const textData = searchtxt.toUpperCase();

      return resData.indexOf(textData) > -1;
    });

    console.log('processSearch() => data', resultSearch);

    this.setState({
      datalist: resultSearch,
    });

    //that.filterLocation(resultSearch)
  }
  //
  render() {
    const {datalist} = this.state;
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
            {'Kontak Saya'}
          </Text>
        </View>
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
        <View style={styles.container}>
          {datalist.length > 0 && (
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
          {datalist.length == 0 && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Tidak Ada Kontak</Text>
            </View>
          )}
        </View>
      </View>
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
      {this.props.appmode == 1 && (
        <Text
          style={{
            borderWidth: 0,
            fontSize: moderateScale(25),
            fontFamily: fonts.FONT_PRIMARY,
          }}>
          {item.name}
        </Text>
      )}
    </TouchableOpacity>
  );
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    token: state.token,
    appmode: state.appmode,
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
    updateTarget: values =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TARGET,
        value: values,
      }),
    updateTarget: data =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TARGET,
        value: data,
      }),
    updateFriendlist: values =>
      dispatch({
        type: ACTION_TYPE.UPDATE_KONTAKLIST,
        value: values,
      }),
  };
}
export default connect(
  mapStateToProps,
  dispatchToProps,
)(withNavigationFocus(KontakScreen));
