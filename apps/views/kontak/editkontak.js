import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Buttons from '../../components/Buttons';
import {convertWidth} from '../../configs/utils';
import {styles} from '../../styles';
import {moderateScale} from '../../styles/scaling';
import Forminput from '../../components/Forminput';

class KontakEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    const dataprops = this.props.navigation.getParam('datas', null);
    this.setState({data: dataprops});
  }
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
        </View>
        <View
          style={{
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Buttons
            style={{margin: 10, width: convertWidth(45)}}
            onPressButton={() => this.props.navigation.goBack()}>
            <Text>Batal</Text>
          </Buttons>
          <Buttons
            style={{margin: 10, width: convertWidth(45)}}
            onPressButton={() => this.props.navigation.goBack()}>
            <Text>Simpan</Text>
          </Buttons>
        </View>
      </View>
    );
  }
}

export default KontakEditScreen;
