import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Buttons from '../../components/Buttons';
import {convertWidth} from './../../configs/utils';
import {styles} from '../../styles';
import {moderateScale} from '../../styles/scaling';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../../redux/actions/actions';
class KontakScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datalist: this.props.friendlist,
    };
  }
  onSelectFriend(item) {
    this.props.navigation.navigate('detailkontakscreen', {datas: item});
  }
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
        </View>
        <View style={{flex: 0.2}}>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.props.navigation.goBack()}>
            <Text>Kembali</Text>
          </Buttons>
        </View>
      </View>
    );
  }
  celllist = ({item, index}) => (
    <TouchableOpacity
      onPress={() => this.onSelectFriend(item)}
      style={{
        borderWidth: 1,
        marginVertical: 1,
        width: convertWidth(80),
        paddingVertical: moderateScale(10),
      }}>
      <Text style={{marginLeft: 10}}>{item.nama}</Text>
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
    updateTarget: values =>
      dispatch({
        type: ACTION_TYPE.UPDATE_TARGET,
        value: values,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(KontakScreen);
