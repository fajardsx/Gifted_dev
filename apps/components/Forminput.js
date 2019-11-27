import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import {convertWidth} from '../configs/utils';
import {moderateScale} from '../styles/scaling';

export default class Forminput extends PureComponent {
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
    console.log('callonpress');
    if (this.props.onPressButton) {
      this.props.onPressButton();
    }
  }
  render() {
    return (
      <View
        style={[
          styles,
          this.props.stylecontainer ? this.props.stylecontainer : null,
        ]}>
        <Text>{this.props.title ? this.props.title : ''}</Text>
        <TextInput
          keyboardType={
            this.props.keyboardtype ? this.props.keyboardtype : 'default'
          }
          secureTextEntry={this.props.securetxt ? this.props.securetxt : false}
          onChangeText={this.props.onChangeText}
          defaultValue={this.props.defaultText}
          style={[
            stylesinput,
            this.props.styleinput ? this.props.styleinput : null,
          ]}
          placeholder={
            this.props.placeholder ? this.props.placeholder : this.props.title
          }
        />
      </View>
    );
  }
}

let styles = {
  flex: 1,
  //justifyContent: 'center',
  //alignItems: 'center',
  position: 'relative',
};
let stylesinput = {
  borderBottomWidth: 1,
};
