import React, {PureComponent} from 'react';
import {Text, View, Alert} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
//local
import Constants from '../configs/constant';
import Buttons from './Buttons';
import {styles} from '../styles';

MapboxGL.setAccessToken(Constants.MAPBOX_KEYS);
export default class MapsBoxComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      latitude: -6.2188339,
      longitude: 106.7950098,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      direction: null,
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
      Alert.alert('location', error);
    }
  }
  ReqCurrentLocation() {
    try {
      Geolocation.getCurrentPosition(
        position =>
          this.setState(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              longitudeDelta: 0.02,
              latitudeDelta: 0.02,
            },
            () => {
              this.onGetDirection();
            },
          ),
        error => {
          console.log('error', error);
          this.onReqUserLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 1000,
        },
      );
    } catch (error) {
      Alert.alert('location', error);
    }
  }
  //
  onGetDirection() {
    const {latitude, longitude} = this.state;

    let concatLot = latitude + ',' + longitude;
    console.log('onGetDirection', concatLot);
    this.setState(
      {
        concat: concatLot,
      },
      () => {
        //this.getDirections(this.state.concatLot, '-6.2207017,106.7813473');
      },
    );
  }
  //
  render() {
    const {latitude, longitude} = this.state;
    return (
      <View style={styles.container}>
        {latitude && longitude && (
          <MapboxGL.MapView
            ref={c => (this.mapbox = c)}
            zoomLevel={1}
            centerCoordinate={[latitude, longitude]}
            style={{flex: 1}}></MapboxGL.MapView>
        )}
      </View>
    );
  }
}
