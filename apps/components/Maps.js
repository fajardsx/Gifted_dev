import React, {PureComponent} from 'react';
import {Text, View, Alert, StyleSheet} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import {lineString as makeLineString} from '@turf/helpers';
import findDistance from '@turf/distance';
import PulseCircleLayer from './PulseCircleLayer';
import {directionClient} from './MapClient';
import RouteSimulator from './RouterSimulator';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../redux/actions/actions';
//local
import Constants from '../configs/constant';
import Buttons from '../components/Buttons';
import {styles} from '../styles';

let context = null;
class MapsComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      latitudeDelta: 1,
      longitudeDelta: 1,
      direction: null,
      region: null,
      direction: null,
      routeSimulator: null,
      currentpoint: null,
      destinationPoint: null,
      navi: null,
      userSelectedUserTrackingMode: 'none',
      target: null,
      naviMode: false,
      zoom: 17,
    };
    context = this;
  }
  componentDidMount() {
    this.onReqUserLocation();
  }
  //RECEIVED UPDATE PROPS
  static getDerivedStateFromProps(props, state) {
    if (props.target !== state.target) {
      context.onGetDirection(props.target);
      return {
        target: props.target,
        direction: null,
      };
    }
    return null;
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
              longitudeDelta: 0.001,
              latitudeDelta: 0.001,
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                longitudeDelta: 0.001,
                latitudeDelta: 0.001,
              },
            },
            () => {
              //this.onGetDirection();
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
    const {region, target} = this.state;
    if (target) {
      let concatLot = region.latitude + ',' + region.longitude;
      let locTarget = [target.kordinat.longitude, target.kordinat.latitude];
      console.log('onGetDirection', concatLot);
      this.getDirectionsNavigation(concatLot, locTarget);
    }
  }
  //GET ROUTE
  async getDirectionsNavigation(startlocate, destinationlocate) {
    console.log('getDirections');
    console.log('from', startlocate);
    console.log('to', destinationlocate);

    const reqOptons = {
      waypoints: [{coordinates: startlocate}, {coordinates: destinationlocate}],
      profile: 'walking',
      geometries: 'geojson',
    };

    try {
      const res = await directionClient.getDirections(reqOptons).send();
      this.setState(
        {
          direction: makeLineString(res.body.routes[0].geometry.coordinates),
          navi: res,
          destinationPoint: destinationlocate,
        },
        () => {
          console.log(
            'getDirectionsNavigation()=> direction ',
            this.state.direction,
          );
          console.log(
            'getDirectionsNavigation()=> findDistance ',
            findDistance(startlocate, destinationlocate, {units: 'miles'}),
          );
        },
      );

      console.log('mapbox.js => getDirectionsNavigation res', res);
      return true;
    } catch (error) {
      console.log('mapsbox.js => getDirectionsNavigation', error);
      return error;
    }
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
  onregionchange(region) {
    this.setState({region});
  }
  //
  render() {
    const {latitude, longitude} = this.state;
    return (
      <View style={styles.container}>
        {latitude && longitude && (
          <MapView
            style={[StyleSheet.absoluteFillObject, {position: 'absolute'}]}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={this.state.region}
            //onRegionChange={this.onregionchange.bind(this)}
            region={{
              latitude: latitude ? latitude : -6.2188339,
              longitude: longitude ? longitude : 106.7950098,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
            }}>
            <Marker
              coordinate={this.state.region}
              title={'Your Location'}
              description={`${latitude}.${longitude}`}
            />
          </MapView>
        )}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    users: state.user,
  };
}
function dispatchToProps(dispatch) {
  return {
    updateuser: user =>
      dispatch({
        type: ACTION_TYPE.UPDATE_USER,
        value: user,
      }),
  };
}
export default connect(mapStateToProps, dispatchToProps)(MapsComponent);
