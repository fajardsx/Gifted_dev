import React, {PureComponent} from 'react';
import {Text, View, Alert} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
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
      latitudeDelta: 1,
      longitudeDelta: 1,
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
              longitudeDelta: 0.005,
              latitudeDelta: 0.005,
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
  async getDirections(startlocate, destinationlocate) {
    console.log('getDirections');
    try {
      let api = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startlocate}&destination=${destinationlocate}&key=${Constants.MAP_KEYS}`,
      );
      let resultApi = await api.json();
      console.log('resultApi', resultApi);
      let points = Polyline.decode(
        resultApi.routes[0].overview_polyline.points,
      );
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      //console.log('coords', coords);
      this.setState({direction: coords});
      return coords;
    } catch (error) {
      console.log('coords', error);
      return error;
    }
  }
  //
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
            <Marker
              coordinate={{
                latitude: latitude ? latitude : -6.2188339,
                longitude: longitude ? longitude : 106.7950098,
              }}
              title={'Your Location'}
              description={`${latitude}.${longitude}`}
            />
          </MapView>
        )}
      </View>
    );
  }
}
