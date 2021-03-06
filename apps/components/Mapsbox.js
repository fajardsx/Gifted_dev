import React, {Component} from 'react';
import {Text, View, Alert, Image} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import getDirections from 'react-native-google-maps-directions';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {lineString as makeLineString} from '@turf/helpers';
import findDistance from '@turf/distance';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../redux/actions/actions';
//local
import Constants from '../configs/constant';
import Buttons from './Buttons';
import {styles, colors} from '../styles';
import PulseCircleLayer from './PulseCircleLayer';
import {directionClient} from './MapClient';
import RouteSimulator from './RouterSimulator';
import {
  convertWidth,
  convertHeight,
  callVibrate,
  onCallTTS,
} from '../configs/utils';
import {moderateScale} from '../styles/scaling';
import Bubble from './Bubble';
import Iconmove from '../assets/images/vector/walk.svg';
import Iconrefresh from '../assets/images/vector/refresh.svg';

MapboxGL.setAccessToken(Constants.MAPBOX_KEYS);

const mapstyles = {
  directionsLine: {
    lineWidth: 3,
    lineColor: colors.lines.COLOR_LINE_STEP,
    lineCap: MapboxGL.LineCap.Round,
    lineJoin: MapboxGL.LineJoin.Round,
  },
};
let context = null;
class MapsBoxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: -6.2188339,
      longitude: 106.7950098,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      timestamp: null,
      altitude: null,
      heading: null,
      accuracy: null,
      speed: null,
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
    this.onstartsimulator = this.onStart.bind(this);
    this.onRegionDidChange = this.onRegionDidChange.bind(this);
  }
  componentDidMount() {
    this.onReqUserLocation();
    //this.getInfoUserTrackingMode();
    MapboxGL.setTelemetryEnabled(false);

    //TRACKING
    this.userposition = Geolocation.watchPosition(position => {
      const lastposition = position;
      console.log('MapBox.js => userposition', lastposition);
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
  //START NAVIGATE
  onStart() {
    const {target} = this.state;
    const {users} = this.props;
    console.log('mapsbox.js => onStart');
    console.log('mapsbox.js => user ', users);
    console.log('mapsbox.js => target ', target);
    callVibrate();
    onCallTTS('Memulai Navigasi');
    // const routeSimulator = new RouteSimulator(this.state.direction);
    // routeSimulator.addListener(currentpoint => this.setState({currentpoint}));
    // routeSimulator.start();
    // this.setState(
    //   {
    //     routeSimulator,
    //   },
    //   () => {
    //     this.onTrackingChange(MapboxGL.UserTrackingModes.FollowWithHeading);
    //   },
    // );
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
  onStop() {
    if (this.state.routeSimulator) {
      this.state.routeSimulator.stop();
      this.setState({naviMode: false, currentpoint: null}, () => {
        context.onTrackingChange('none');
      });

      this.props.onCancel();
    } else {
      this.setState({naviMode: false, currentpoint: null}, () => {
        context.onTrackingChange('none');
      });

      this.props.onCancel();
    }
  }
  //USER LOCATION
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
              //this.onGetDirection();
              this.props.onUpdate({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
          ),
        error => {
          console.log('error ReqCurrentLocation', error);
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
    if (target) {
      const {latitude, longitude} = this.state;

      let concatLot = [longitude, latitude];
      let locTarget = [parseFloat(target.long), parseFloat(target.lat)];

      this.getDirectionsNavigation(concatLot, locTarget);
    }
  }
  //GET ROUTE
  async getDirectionsNavigation(startlocate, destinationlocate) {
    console.log('getDirections');
    console.log('from', startlocate);
    console.log('to', destinationlocate);
    console.log(
      'MapboxGL.geoUtils.makePoint ',
      MapboxGL.geoUtils.makePoint(destinationlocate),
    );
    console.log(
      'getDirectionsNavigation()=> findDistance ',
      findDistance(startlocate, destinationlocate, {units: 'miles'}),
    );

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

    // let url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startlocate};${destinationlocate}?approaches=unrestricted;curb&access_token=${Constants.MAPBOX_KEYS}&geometries=geojson`;
    // console.log('to', url);
    // try {
    //   let api = await fetch(url);
    //   let resultApi = await api.json();
    //   console.log('resultApi', resultApi);
    //   let points = Polyline.decode(resultApi.routes[0].geometry);
    //   let coords = points.map((point, index) => {
    //     return {
    //       latitude: point[0],
    //       longitude: point[1],
    //     };
    //   });
    //   // console.log('coords', Object.assign({}, coords));
    //   this.setState({direction: resultApi.routes[0].geometry, navi: resultApi});
    //   return true;
    // } catch (error) {
    //   console.log('coords', error);
    //   return error;
    // }
  }
  //
  async onRegionDidChange() {
    const zoom = await this.mapbox.getZoom();
    this.setState({zoom});
  }
  //=========================================RENDER=======================================
  render() {
    const {
      latitude,
      longitude,
      userSelectedUserTrackingMode,
      zoom,
      target,
    } = this.state;
    return (
      <View style={styles.container}>
        {latitude && longitude && (
          <MapboxGL.MapView
            ref={c => (this.mapbox = c)}
            onRegionDidChange={this.onRegionDidChange}
            showUserLocation={true}
            onUserLocationUpdate={this.onUserLocationUpdate}
            userTrackingMode={MapboxGL.UserTrackingModes.Follow}
            style={{flex: 1}}>
            <MapboxGL.Camera
              defaultSettings={{
                zoomLevel: 17,
                //centerCoordinate: [longitude, latitude],
              }}
              zoomLevel={zoom}
              centerCoordinate={[longitude, latitude]}
              followUserLocation={userSelectedUserTrackingMode != 'none'}
              followUserMode={
                userSelectedUserTrackingMode != 'none'
                  ? userSelectedUserTrackingMode
                  : MapboxGL.UserTrackingModes.Follow
              }
              onUserTrackingModeChange={this.onTrackChange.bind(this)}
            />
            {this.renderOrigin()}
            {this.renderLine()}
            {this.renderCurrentPoint()}
            {this.renderProgressLine()}
            {this.renderUserLocation()}
            {target && (
              <MapboxGL.ShapeSource
                id="destination"
                shape={MapboxGL.geoUtils.makePoint([
                  parseFloat(target.long),
                  parseFloat(target.lat),
                ])}>
                {
                  //ADD DESTINATION CIRCLE
                }
                <MapboxGL.CircleLayer
                  id="destinationInnerCircle"
                  style={layerStyles.destination}
                />
              </MapboxGL.ShapeSource>
            )}
          </MapboxGL.MapView>
        )}
        {this.onRenderNavi()}
      </View>
    );
  }
  // renderAnnotations() {
  //   const {direction} = this.state;
  //   const items = [];
  //   console.log('renderAnnotations', direction);
  //   if (direction == null) {
  //     return null;
  //   }
  //   for (let i = 0; i < direction.length; i++) {
  //     items.push(this.renderRouteAnnotation(direction[i]));
  //   }
  //   return items;
  // }
  // renderRouteAnnotation(item) {
  //   console.log('renderRouteAnnotation', item);
  //   return (
  //     <MapboxGL.PointAnnotation
  //       key="pointAnnotation"
  //       id="pointAnnotation"
  //       coordinate={[item.longitude, item.latitude]}>
  //       <View style={styles.annotationContainer}>
  //         <View style={styles.annotationFill} />
  //       </View>
  //       <MapboxGL.Callout title="An annotation here!" />
  //     </MapboxGL.PointAnnotation>
  //   );
  // }
  //RENDER USER START LOCATION
  renderUserAnnotation() {
    const {latitude, longitude} = this.state;
    return (
      <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={[longitude, latitude]}>
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <MapboxGL.Callout title="Your Here!" />
      </MapboxGL.PointAnnotation>
    );
  }
  renderUserLocation() {
    const {latitude, longitude} = this.state;
    return <MapboxGL.UserLocation key="userLocation" id="userLocation" />;
  }
  //RENDER LINE ROUTE
  renderLine() {
    const {direction} = this.state;

    if (direction == null) {
      return null;
    }
    console.log('renderLine', direction);
    return (
      <MapboxGL.ShapeSource id="routeSource" shape={direction}>
        <MapboxGL.LineLayer
          id="routeFill"
          belowLayerID={'originInnerCircle'}
          style={layerStyles.route}
        />
      </MapboxGL.ShapeSource>
    );
  }
  //RENDER USER ROUTE POINT
  renderCurrentPoint() {
    const {currentpoint} = this.state;

    if (currentpoint == null) {
      return;
    }
    console.log('renderCurrentPoint', currentpoint);
    return (
      <PulseCircleLayer
        shape={currentpoint}
        aboveLayerID="destinationInnerCircle"
      />
    );
  }
  //RENDER USER ROUTE PROGGRESS
  renderProgressLine() {
    const {currentpoint, direction} = this.state;

    if (!currentpoint || !direction) {
      return null;
    }
    console.log('renderProgressLine', currentpoint);
    const {nearestIndex} = currentpoint.properties;
    const coords = direction.geometry.coordinates.filter(
      (c, i) => i <= nearestIndex,
    );
    coords.push(currentpoint.geometry.coordinates);

    if (coords.length < 2) {
      return null;
    }
    const lineString = makeLineString(coords);
    return (
      <MapboxGL.Animated.ShapeSource id="progressSource" shape={lineString}>
        <MapboxGL.Animated.LineLayer
          id="progressFill"
          style={layerStyles.progress}
          aboveLayerID="routeFill"
        />
      </MapboxGL.Animated.ShapeSource>
    );
  }
  //RENDER USER ROUTE TARGET LINE
  renderOrigin() {
    const {currentpoint, direction, destinationPoint} = this.state;
    let backgroundColor = 'white';

    if (currentpoint) {
      backgroundColor = '#314ccd';
    }

    const style = [layerStyles.origin, {circleColor: backgroundColor}];

    return (
      <MapboxGL.ShapeSource
        id="origin"
        shape={MapboxGL.geoUtils.makePoint(destinationPoint)}>
        <MapboxGL.Animated.CircleLayer id="originInnerCircle" style={style} />
      </MapboxGL.ShapeSource>
    );
  }
  //RENDER USER TARGET DESTINATION  POINT
  renderTargetPoint() {
    const {target} = this.state;
    if (target == null) {
      return;
    }
    return (
      <PulseCircleLayer
        shape={MapboxGL.geoUtils.makePoint([
          target.kordinat.longitude,
          target.kordinat.latitude,
        ])}
        aboveLayerID="destinationInnerCircle"
      />
    );
  }
  //
  renderLocationInfo() {
    // if (this.state.timestamp <= 0) {
    //   return null;
    // }
    return (
      <Bubble>
        {/* <Text>Timestamp: {this.state.timestamp}</Text> */}
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text>Altitude: {this.state.altitude}</Text>
        {/* <Text>Heading: {this.state.heading}</Text>
        <Text>Accuracy: {this.state.accuracy}</Text>
        <Text>Speed: {this.state.speed}</Text> */}
      </Bubble>
    );
  }
  //TRACKING
  //INFO
  getInfoUserTrackingMode() {
    this._trackingOptions = Object.keys(MapboxGL.UserTrackingModes)
      .map(key => {
        return {
          label: key,
          data: MapboxGL.UserTrackingModes[key],
        };
      })
      .concat([
        {
          label: 'None',
          data: 'none',
        },
      ])
      .sort(function onSortOptions(a, b) {
        if (a.label < b.label) {
          return -1;
        }

        if (a.label > b.label) {
          return 1;
        }

        return 0;
      });
    console.log('mapsbox.js => getInfoUserTrackingMode', this._trackingOptions);
  }
  //
  onTrackingChange(userTrackingMode) {
    this.setState({
      userSelectedUserTrackingMode: userTrackingMode,
      currentTrackingMode: userTrackingMode,
    });
  }
  //
  onTrackChange(e) {
    const {followUserMode} = e.nativeEvent.payload;
    this.setState({userSelectedUserTrackingMode: followUserMode || 'none'});
  }
  onUserLocationUpdate(location) {
    console.log('mapsbox.js => onUserLocationUpdate', location);
    this.setState(
      {
        timestamp: location.timestamp,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed,
      },
      () => {
        this.props.onUpdate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      },
    );
  }

  //COMMAND
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
const layerStyles = {
  origin: {
    circleRadius: 5,
    circleColor: 'white',
  },
  destination: {
    circleRadius: moderateScale(15),
    circleColor: 'red',
  },
  route: {
    lineColor: 'blue',
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 3,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#000',
    lineWidth: 3,
  },
};
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    friendtarget: state.currentFriendTarget,
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
export default connect(mapStateToProps, dispatchToProps)(MapsBoxComponent);
