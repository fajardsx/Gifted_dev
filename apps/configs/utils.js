import React, {Component} from 'react';
import {Alert, Dimensions, Vibration} from 'react-native';
import {
  heightPercentageToDP as sh,
  widthPercentageToDP as sw,
} from 'react-native-responsive-screen';
import {colors} from '../styles/colors';
import {moderateScale} from '../styles/scaling';
import Constants from './constant';
import Tts from 'react-native-tts';
const vibrateduration = 1000;
//validate email
export function validateEmail(text) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //   if(reg.test(text) === )
  return reg.test(text);
}
//--------------------------------------------------------------------------------------------
//CALL ALERT
//call alert with parameter
export function callAlert(title, msg, onYes) {
  Alert.alert(
    title,
    msg,
    onYes != null
      ? [
          {text: 'Yes', onPress: () => onYes()},
          {text: 'No', onPress: () => console.log('')},
        ]
      : null,
  );
}
//
//callculate size responsive
export function convertWidth(params) {
  return sw(params);
}
export function convertHeight(params) {
  return sh(params);
}

export function deviceWidth() {
  return Dimensions.get('window').width;
}

export function deviceHeight() {
  return Dimensions.get('window').height;
}
//Button Vibreate
export function callVibrate() {
  let vibrateduration = 100;
  Vibration.vibrate(vibrateduration);
  let limit = setTimeout(() => {
    Vibration.cancel();
    clearTimeout(limit);
  }, vibrateduration);
  return limit;
}
//COMMAND
export function findCommad(id) {
  let data = 'Text';
  switch (id.toLowerCase()) {
    case 'cari':
      return Constants.COMMAND_CARI;
    case 'lokasi':
      return Constants.COMMAND_CARI;
    case 'tambah':
      return Constants.COMMAND_TAMBAH;
    default:
      return -1;
  }
}
//TTS
//TTS
export function onCallTTS(value) {
  return Tts.speak(value);
}
//ARRAY TO ARRAY OF OBJECT
export function convertToArrayOfObjects(data) {
  Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
  };

  data.insert(0, ['longitude', 'latitude']);

  var keys = data.shift(),
    i = 0,
    k = 0,
    obj = null,
    output = [];

  for (i = 0; i < data.length; i++) {
    obj = {};

    for (k = 0; k < keys.length; k++) {
      obj[keys[k]] = data[i][k];
    }

    output.push(obj);
  }

  return output;
}
//--------------------------------------------------------------------------------------------
