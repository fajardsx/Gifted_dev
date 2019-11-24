import React, {PureComponent} from 'react';
import {Text, View, Alert} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
//local
import Constants from '../configs/constant';
import Buttons from '../components/Buttons';
import {styles} from '../styles';
export default class MapsComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }
  componentDidMount() {
    this.onReqUserLocation();
  }
  onReqUserLocation() {
    try {
      let author = Geolocation.requestAuthorization();
      this.ReqCurrentLocation();
    } catch (error) {
      Alert.alert('location', error.message);
    }
  }
  ReqCurrentLocation() {
    try {
      Geolocation.getCurrentPosition(
        position =>
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            longitudeDelta: 0.02,
            latitudeDelta: 0.02,
          }),
        error => {
          console.log('error', error.message);
          this.onReqUserLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 1000,
        },
      );
    } catch (error) {
      Alert.alert('location', error.message);
    }
  }
  render() {
    const {latitude, longitude} = this.state;
    return (
      <View style={styles.container}>
        {latitude && longitude && (
          <MapView
            style={{flex: 1}}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={this.state}
            region={{
              latitude: latitude ? latitude : -6.2188339,
              longitude: longitude ? longitude : 106.7950098,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
            }}>
            {latitude && (
              <Marker
                coordinate={{
                  latitude: latitude ? latitude : -6.2188339,
                  longitude: longitude ? longitude : 106.7950098,
                }}
                title={'Your Location'}
                description={`${latitude}.${longitude}`}
              />
            )}
          </MapView>
        )}
      </View>
    );
  }
}
