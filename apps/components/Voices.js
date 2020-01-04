import React, {PureComponent} from 'react';
import {View, Text, ScrollView} from 'react-native';
//third
import Voices from 'react-native-voice';
import Tts from 'react-native-tts';
//REDUX
import {connect} from 'react-redux';
//local
import Constants from '../configs/constant';
import Buttons from '../components/Buttons';
import {styles, fonts} from '../styles';
import {
  convertWidth,
  convertHeight,
  callVibrate,
  onCallTTS,
} from '../configs/utils';
import {moderateScale} from '../styles/scaling';
import IconMic from '../assets/images/vector/microphone.svg';

const iconsize = moderateScale(30);
class VoicesComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      stared: '',
      results: [],
      isSupport: false,
      isStart: false,
    };

    this.init();
  }
  componentDidMount() {
    this.checkSupport();
  }
  componentWillUnmount() {
    console.log('Voices Destroy');
    Voices.destroy().then(Voices.removeAllListeners);
  }
  init() {
    console.log('Voices Init');
    Voices.onSpeechStart = this.onSpeechStart.bind(this);
    Voices.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voices.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voices.onSpeechResults = this.onSpeechResult.bind(this);
    Voices.onSpeechError = this.onSpeechError.bind(this);
  }
  //EVENT
  async checkSupport() {
    let support = await Voices.isAvailable();
    console.log('Voices Support', support);
  }
  async checkReconized() {
    let support = await Voices.isRecognizing();
    console.log('Voices Recognizing', support);
    return support;
  }
  async checkReconizedServices() {
    let support = await Voices.getSpeechRecognitionServices();
    console.log('Voices Services', support);
  }
  onSpeechError(e) {
    console.log('onSpeechError', e);
    this.thisCallTTS('Silahkan Ulangi Lagi');
    this.setState({
      isStart: false,
      results: [],
    });
  }
  onSpeechEnd(e) {
    console.log('onSpeechEnd', e);
    this.setState({
      isStart: false,
    });
  }
  onSpeechStart(e) {
    console.log('onSpeechStart', e);
    this.setState({
      stared: '√',
    });
  }
  onSpeechRecognized(e) {
    console.log('onSpeechRecognized', e);
    this.setState({
      recognized: '√',
    });
  }
  onSpeechResult(e) {
    console.log('onSpeechResult', e);
    this.setState(
      {
        isStart: false,
        results: e.value,
      },
      () => {
        this.thisCallTTS(this.state.results[0]);

        this.props.onCallback(this.state.results[0]);
      },
    );
  }
  onStartRecognition(e) {
    console.log('START SPEECH');
    callVibrate();
    if (Constants.DEV_MODE) {
      return this.props.navigation.navigate('resultsearchscreen', {
        valuesearch: '',
        functOnProcess: () => this.props.onProcess(),
      });
    }
    this.thisCallTTS(this.props.tts ? this.props.tts : 'Cari Lokasi');
    let timeStart = setTimeout(async () => {
      this.setState({
        recognized: '',
        started: '',
        results: [],
        isStart: true,
      });
      try {
        await Voices.start(Constants.LOCALE);
      } catch (e) {
        console.error(e);
      }
      clearTimeout(timeStart);
    }, 2000);
  }
  //TTS
  thisCallTTS(value) {
    onCallTTS(value);
  }
  //RENDER
  render() {
    const {results, isStart} = this.state;
    return (
      <View
        style={[
          {
            position: 'absolute',

            borderRadius: 5,
            overflow: 'hidden',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          this.props.style ? this.props.style : null,
        ]}>
        {isStart === false && (
          <Buttons
            style={{
              padding: 10,
              backgroundColor: '#f0f0f0',
              width: convertWidth(35),
              height: convertHeight(15),
            }}
            onPressButton={this.onStartRecognition.bind(this)}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{borderWidth: 0, textAlign: 'center'}}>
                  {this.props.label ? this.props.label : 'Cari Lokasi'}
                </Text>
                {this.props.appmode == 1 && (
                  <Text
                    style={{
                      borderWidth: 0,
                      fontSize: moderateScale(25),
                      fontFamily: fonts.FONT_PRIMARY,
                    }}>
                    {this.props.label ? this.props.label : 'Cari\nLokasi'}
                  </Text>
                )}
              </View>

              <IconMic height={iconsize} width={iconsize} />
            </View>
          </Buttons>
        )}
        {isStart === true && (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              width: convertWidth(40),
              height: convertHeight(15),
              justifyContent: 'center',
            }}>
            <IconMic height={iconsize * 2} width={iconsize * 2} />
            <Text style={{borderWidth: 0}}>{'Mendengarkan'}</Text>
            {this.props.appmode == 1 && (
              <Text
                style={{
                  borderWidth: 0,
                  fontSize: moderateScale(25),
                  fontFamily: fonts.FONT_PRIMARY,
                }}>
                {'Mendengarkan'}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    token: state.token,
    appmode: state.appmode,
  };
}
export default connect(mapStateToProps)(VoicesComponent);
