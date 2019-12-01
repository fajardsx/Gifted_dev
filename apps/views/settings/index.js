import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Buttons from '../../components/Buttons';
import {convertWidth, callVibrate} from './../../configs/utils';
import {styles} from '../../styles';
import {moderateScale} from '../../styles/scaling';

class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onEventClick(id) {
    callVibrate();
    switch (id) {
      case 'kontaksaya':
        this.props.navigation.navigate('kontakscreen');
        break;
      case 'profil':
        break;
      case 'cariteman':
        this.props.navigation.navigate('carikontakscreen');
        break;
      case 'caritempat':
        break;
      case 'kembali':
        this.props.navigation.goBack();
        break;
    }
  }
  render() {
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
            {'Pengaturan'}
          </Text>
        </View>

        <View style={styles.container}>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.onEventClick('kontaksaya')}>
            <Text>Kontak Saya</Text>
          </Buttons>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.onEventClick('cariteman')}>
            <Text>Cari Teman</Text>
          </Buttons>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.onEventClick('profil')}>
            <Text>Profil Saya</Text>
          </Buttons>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.onEventClick('caritempat')}>
            <Text>Cari tempat</Text>
          </Buttons>
        </View>
        <View style={styles.container}>
          <Buttons
            style={{margin: 10, width: convertWidth(95)}}
            onPressButton={() => this.onEventClick('kembali')}>
            <Text>Kembali</Text>
          </Buttons>
        </View>
      </View>
    );
  }
}

export default SettingScreen;
