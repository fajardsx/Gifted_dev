import React, {PureComponent} from 'react';
import {Text, View, Alert, StyleSheet} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
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
import {
  convertToArrayOfObjects,
  convertHeight,
  callVibrate,
  onCallTTS,
  showToast,
} from '../configs/utils';
import {convertWidth} from './../configs/utils';

import Iconmove from '../assets/images/vector/walk.svg';
import Iconrefresh from '../assets/images/vector/refresh.svg';
import IconCenter from '../assets/images/vector/iconcentermap.svg';
import {moderateScale} from '../styles/scaling';
import {TouchableOpacity} from 'react-native-gesture-handler';

let context = null;
class MapsComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      latitude: -6.2188339,
      longitude: 106.7950098,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
      direction: null,
      region: {
        latitude: -6.2188339,
        longitude: 106.7950098,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001,
      },
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
      console.log('Map.js => getDerivedStateFromProps', props.target);

      context.onGetDirection(props.target);
      return {
        target: props.target,
        direction: null,
      };

      console.log('Map.js => target', props.target);
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
          //this.onReqUserLocation();
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
    const {latitude, longitude} = this.state;

    if (!target) return;
    if (target) {
      let concatLot = [longitude, latitude];
      let locTarget = [parseFloat(target.long), parseFloat(target.lat)];
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
  //START NAVIGATE
  onStop() {
    this.setState({direction: null});
    this.props.onCancel();
  }
  onStart() {
    const {target} = this.state;
    const {users} = this.props;
    console.log('mapsbox.js => onStart');
    console.log('mapsbox.js => user ', users);
    console.log('mapsbox.js => target ', target);
    callVibrate();

    onCallTTS('Memulai Navigasi');

    //WITH GOOGLE APPS
    const data = {
      source: {
        latitude: parseFloat(users.lat),
        longitude: parseFloat(users.long),
      },
      destination: {
        latitude: parseFloat(target.lat),
        longitude: parseFloat(target.long),
      },
      params: [
        {
          key: 'travelmode',
          value: 'walking', // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate', // this instantly initializes navigation using the given travel mode
        },
      ],
    };
    getDirections(data);
  }
  //

  myLocationChange = event => {
    const myLocation = event.nativeEvent.coordinate;
    // console.log('myLocationChange', myLocation);
    let latitude = myLocation.latitude;
    let longitude = myLocation.longitude;

    //console.log('myLocationChange => tempregion', tempregion);
    //this.setState({latitude, longitude});
    let temp = Object.assign({}, this.props.users);
    //(temp.lat = latitude), (temp.long = longitude), this.props.updateuser(temp);
  };
  onCenterPosition() {
    this.setState({
      region: {
        latitude: this.props.users.lat,
        longitude: this.props.users.long,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001,
      },
    });
  }
  //
  render() {
    const {latitude, longitude, target} = this.state;
    return (
      <View style={styles.container}>
        {latitude && longitude && (
          <MapView
            ref={res => (this.mapslayout = res)}
            style={[StyleSheet.absoluteFillObject, {width: convertWidth(100)}]}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            initialRegion={this.state.region}
            onUserLocationChange={this.myLocationChange}
            onRegionChange={this.onregionchange.bind(this)}
            region={{
              latitude: latitude ? latitude : -6.2188339,
              longitude: longitude ? longitude : 106.7950098,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: this.state.longitudeDelta,
            }}>
            {this.renderLineRoute()}
            {/* <Marker
              coordinate={this.state.region}
              title={'Your Location'}
              description={`${latitude}.${longitude}`}
            /> */}
            {target && (
              <Marker
                coordinate={{
                  latitude: parseFloat(target.lat),
                  longitude: parseFloat(target.long),
                  longitudeDelta: 0.001,
                  latitudeDelta: 0.001,
                }}
                title={`${target.name} Location`}
                description={`${target.lat}.${target.long}`}
              />
            )}
          </MapView>
        )}

        {this.onRenderNavi()}
        {this.onRenderCenter()}
      </View>
    );
  }
  //COMMAND
  onRenderCenter() {
    return (
      <View
        style={{
          top: '5%',
          right: '5%',
          width: moderateScale(50),
          height: moderateScale(50),
          position: 'absolute',
          backgroundColor: colors.background.COLOR_PRIMARY_2,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: moderateScale(40),
        }}>
        <Buttons
          onPressButton={() => this.onCenterPosition()}
          style={{
            backgroundColor: '#f0f0f0',
            width: moderateScale(50),
            height: moderateScale(50),
            borderWidth: 1,
            borderRadius: moderateScale(40),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconCenter height={moderateScale(40)} width={moderateScale(40)} />
          </View>
        </Buttons>
        <TouchableOpacity onPress={() => showToast('Clik')}></TouchableOpacity>
      </View>
    );
  }
  onRenderNavi() {
    if (this.state.target) {
      return (
        <View
          style={{
            bottom: '5%',
            width: convertWidth(100),
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Buttons
            onPressButton={() => this.onStop()}
            style={{
              backgroundColor: '#f0f0f0',
              width: convertWidth(40),
              height: convertHeight(15),
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Iconrefresh
                height={moderateScale(30)}
                width={moderateScale(30)}
              />
              <Text style={{borderWidth: 0, fontSize: moderateScale(18)}}>
                {'Ulang'}
              </Text>
            </View>
          </Buttons>
          <Buttons
            onPressButton={() => this.onStart()}
            style={{
              backgroundColor: '#f0f0f0',
              width: convertWidth(40),
              height: convertHeight(15),
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Iconmove height={moderateScale(30)} width={moderateScale(30)} />
              <Text style={{borderWidth: 0, fontSize: moderateScale(18)}}>
                {'Mulai'}
              </Text>
            </View>
          </Buttons>
        </View>
      );
    }
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
