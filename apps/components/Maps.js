import React, {PureComponent} from 'react';
import {Text, View, Alert, StyleSheet} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
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
import {styles, colors} from '../styles';
import {convertToArrayOfObjects} from '../configs/utils';

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
      trackingposition: [],
    };
    context = this;
  }
  componentDidMount() {
    this.onReqUserLocation();
    this.userposition = Geolocation.watchPosition(position => {
      const lastposition = position;
      console.log('Map.js => userposition', lastposition);
      let trackingposition = Object.assign([], this.state.trackingposition);
      let data = {
        latitude: lastposition.coords.latitude,
        longitude: lastposition.coords.longitude,
      };
      trackingposition.push({
        longitude: lastposition.coords.longitude,
        latitude: lastposition.coords.latitude,
      });

      this.setState({trackingposition}, () => {
        this.props.onUpdate(data);
      });
    });
  }
  componentWillUnmount() {
    this.userposition != null && Geolocation.clearWatch(this.userposition);
  }
  //RECEIVED UPDATE PROPS
  static getDerivedStateFromProps(props, state) {
    if (props.target !== state.target) {
      context.onGetDirection(props.target);
      console.log('Map.js => target', props.target);
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
              this.props.onUpdate({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              });
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
  onGetDirection(target) {
    const {region} = this.state;
    if (target) {
      let concatLot = [region.longitude, region.latitude];
      let locTarget = [target.long, target.lat];
      console.log('onGetDirection', concatLot);

      this.getDirectionsNavigation(concatLot, locTarget);
      //this.getDirections(concatLot, locTarget);
    }
  }
  //GET ROUTE
  async getDirectionsNavigation(startlocate, destinationlocate) {
    console.log('getDirectionsNavigation');
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
          direction: convertToArrayOfObjects(
            res.body.routes[0].geometry.coordinates,
          ),
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
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startlocate[1] +
          ',' +
          startlocate[0]}&destination=${destinationlocate[1] +
          ',' +
          destinationlocate[0]}&key=${Constants.MAP_KEYS}`,
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
      console.log('coords', coords);
      this.setState({direction: coords});
      return coords;
    } catch (error) {
      console.log('coords', error);
      return error;
    }
  }
  //
  onregionchange(region) {
    //this.setState({region});
    console.log('map.js => onregionchange => region', region);
  }
  //
  renderLineRoute() {
    const {direction} = this.state;

    if (direction == null) {
      return null;
    }

    return (
      <Polyline
        coordinates={direction}
        strokeColor={colors.lines.COLOR_LINE_STEP}
        strokeWidth={6}
      />
    );
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
            onRegionChange={this.onregionchange.bind(this)}
            region={{
              latitude: latitude ? latitude : -6.2188339,
              longitude: longitude ? longitude : 106.7950098,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
            }}>
            {this.renderLineRoute()}
            <Marker
              coordinate={this.state.region}
              title={'Your Location'}
              description={`${latitude}.${longitude}`}
            />
          </MapView>
        )}
        <View style={{position: 'absolute'}}>
          <Text>{JSON.stringify(this.state.trackingposition)}</Text>
        </View>
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
