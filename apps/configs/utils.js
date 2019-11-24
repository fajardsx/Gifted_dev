import React, {Component} from 'react';
import {Alert, Dimensions} from 'react-native';
import {
  heightPercentageToDP as sh,
  widthPercentageToDP as sw,
} from 'react-native-responsive-screen';
import {colors} from '../styles/colors';
import {moderateScale} from '../styles/scaling';

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

//--------------------------------------------------------------------------------------------
