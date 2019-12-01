import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {convertWidth} from '../configs/utils';
import {moderateScale} from '../styles/scaling';

export default class Buttons extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {}
  static getDerivedStateFromProps(props, state) {
    if (props != state) {
      if (props.backgroundColor) {
        styles.backgroundColor = props.backgroundColor;
      }
      if (props.width) {
        styles.backgroundColor = props.width;
      }
      if (props.height) {
        styles.backgroundColor = props.height;
      }
      if (props.padding) {
        styles.padding = props.padding;
      }
      if (props.margin) {
        styles.margin = props.margin;
      }
      if (props.absolute) {
        styles.position = props.absolute ? 'absolute' : 'relative';
      }
      if (props.stickybottom) {
        styles.position = 'absolute';
        styles.bottom = 0;
      }
      return state;
    }
    return null;
  }
  callonpress() {
    //console.log('callonpress');
    if (this.props.onPressButton) {
      this.props.onPressButton();
    } else {
      console.log('no onPressButton function');
    }
  }
  render() {
    return (
      <TouchableOpacity
        style={[styles, this.props.style ? this.props.style : null]}
        onPress={() => this.callonpress()}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

let styles = {
  width: convertWidth(100),
  height: moderateScale(45),
  backgroundColor: '#f1f1f1',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
};
