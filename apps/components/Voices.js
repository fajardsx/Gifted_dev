import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
//third
import Voices from 'react-native-voice';
import Tts from 'react-native-tts';
//local
import Constants from '../configs/constant';
import Buttons from '../components/Buttons';
import {styles} from '../styles';

export default class VoicesComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      stared: '',
      results: [],
      isSupport: false,
      isStart: false,
    };

    Voices.onSpeechStart = this.onSpeechStart.bind(this);
    Voices.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voices.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voices.onSpeechResults = this.onSpeechResult.bind(this);
    Voices.onSpeechError = this.onSpeechError.bind(this);
  }
  componentDidMount() {
    this.checkSupport();
  }
  componentWillUnmount() {
    Voices.destroy().then(Voices.removeAllListeners);
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
    this.setState({
      isStart: false,
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
        results: e.value,
      },
      () => {
        this.onCallTTS(this.state.results[0]);
      },
    );
  }
  onStartRecognition(e) {
    console.log('START SPEECH');
    this.onCallTTS('Silahkan Mulai Berbicara');
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
    }, 3000);
  }
  //TTS
  onCallTTS(value) {
    Tts.speak(value);
  }
  //RENDER
  render() {
    const {results, isStart} = this.state;
    return (
      <View style={styles.container}>
        <Text> Test Speech Reconizer </Text>
        {results.length > 0 && <Text> Resulth</Text>}
        {results.map((results, index) => {
          return (
            <Text
              key={index}
              style={{
                color: '#0C0',
                //borderWidth: 1,
              }}>
              {results}
            </Text>
          );
        })}
        {isStart == false && (
          <Buttons
            stickybottom
            backgroundColor={'#f0f0f0'}
            onPressButton={this.onStartRecognition.bind(this)}>
            <Text style={{borderWidth: 0}}>Start Speech</Text>
          </Buttons>
        )}
      </View>
    );
  }
}
