import React, {PureComponent} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
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
import {callVibrate} from '../../configs/utils';
import {convertWidth} from './../../configs/utils';
import Forminput from '../../components/Forminput';
import VoicesComponent from '../../components/Voices';
const iconSize = moderateScale(40);
class ModalSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissiongrand: false,
      searchtxt: '',
      datalist: this.props.friendlist,
    };
  }
  componentDidMount() {
    this.setState({searchtxt: this.props.valueSearch}, () => {
      this.processSearch();
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.valueSearch !== state.searchtxt) {
      return {
        searchtxt: props.valueSearch,
      };
    }
    return state;
  }
  //Callback
  onCallbackResult(data) {
    let dataSplit = data.split(' ');
    console.log('home/index.js => oncallbackResult ', dataSplit);
  }
  //Setting
  onOpenSetting() {
    callVibrate();
  }
  onChangeInput = text => {
    this.setState({searchtxt: text}, () => {
      this.processSearch();
    });
  };
  //FILTER
  processSearch() {
    const {searchtxt, data} = this.state;
    console.log('data', this.props.friendlist);
    let resultSearch = this.props.friendlist.filter(res => {
      let resData = '';

      // let keyCity = res.city_name ? res.city_name.toUpperCase() : '';
      let keyName = res.name ? res.name.toUpperCase() : '';
      console.log('processSearch() => res', res);
      console.log('processSearch() => searchtxt', searchtxt);
      resData = `${keyName} `;

      const textData = searchtxt.toUpperCase();

      return resData.indexOf(textData) > -1;
    });

    console.log('processSearch() => data', resultSearch);
    //that.filterLocation(resultSearch)
  }
  //RENDER
  render() {
    //const {permissiongrand} = this.state;
    return (
      <Modal
        onBackButtonPress={() => this.props.onClose()}
        isVisible={this.props.isShow ? this.props.isShow : false}>
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
          <FlatList
            style={{paddingVertical: 10}}
            extraData={this.state}
            data={this.state.datalist}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={this.celllist}
          />
          <VoicesComponent
            onCallback={this.onCallbackResult.bind(this)}
            style={{
              position: 'absolute',
              bottom: moderateScale(30),
              top: null,
              left: moderateScale(90),
            }}
          />
        </View>
      </Modal>
    );
  }
  celllist = ({item, index}) => (
    <TouchableOpacity
      onPress={() => this.props.onPress(item)}
      style={{
        borderWidth: 1,
        width: convertWidth(80),
        paddingVertical: moderateScale(10),
      }}>
      <Text style={{marginLeft: 10}}>{item.name}</Text>
    </TouchableOpacity>
  );
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
export default connect(mapStateToProps, dispatchToProps)(ModalSearch);
