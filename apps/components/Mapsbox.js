import React, {PureComponent} from 'react';
import {Text, View, Alert, Image} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import MapboxGL from '@react-native-mapbox-gl/maps';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../redux/actions/actions';
//local
import Constants from '../configs/constant';
import Buttons from './Buttons';
import {styles, colors} from '../styles';

MapboxGL.setAccessToken(Constants.MAPBOX_KEYS);
const coordinatesDummy = [
  [-73.98330688476561, 40.76975180901395],
  [-73.96682739257812, 40.761560925502806],
  [-74.00751113891602, 40.746346606483826],
  [-73.95343780517578, 40.7849607714286],
  [-73.99017333984375, 40.71135347314246],
  [-73.98880004882812, 40.758960433915284],
  [-73.96064758300781, 40.718379593199494],
  [-73.95172119140624, 40.82731951134558],
  [-73.9829635620117, 40.769101775774935],
  [-73.9822769165039, 40.76273111352534],
  [-73.98571014404297, 40.748947591479705],
];
const mapstyles = {
  directionsLine: {
    lineWidth: 3,
    lineColor: colors.lines.COLOR_LINE_STEP,
    lineCap: MapboxGL.LineCap.Round,
    lineJoin: MapboxGL.LineJoin.Round,
  },
};
let context = null;
class MapsBoxComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      latitude: -6.2188339,
      longitude: 106.7950098,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      direction: null,
    };
    context = this;
  }
  componentDidMount() {
    this.onReqUserLocation();
    MapboxGL.setTelemetryEnabled(false);
  }
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
              longitudeDelta: 0.02,
              latitudeDelta: 0.02,
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
  onGetDirection(target) {
    if (target) {
      const {latitude, longitude} = this.state;

      let concatLot = longitude + ',' + latitude;
      let locTarget =
        target.kordinat.longitude + ',' + target.kordinat.latitude;
      console.log('onGetDirection', concatLot);

      this.getDirectionsNavigation(concatLot, locTarget);
    }
  }
  //
  async getDirectionsNavigation(startlocate, destinationlocate) {
    console.log('getDirections');
    console.log('from', startlocate);
    console.log('to', destinationlocate);
    let url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startlocate};${destinationlocate}?approaches=unrestricted;curb&access_token=${Constants.MAPBOX_KEYS}&geometries=geojson`;
    console.log('to', url);
    try {
      let api = await fetch(url);
      let resultApi = await api.json();
      console.log('resultApi', resultApi);
      let points = Polyline.decode(resultApi.routes[0].geometry);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      // console.log('coords', Object.assign({}, coords));
      this.setState({direction: resultApi.routes[0].geometry});
      return true;
    } catch (error) {
      console.log('coords', error);
      return error;
    }
  }
  //
  async onRegionDidChange() {
    // const center = await this.mapbox.getCoordinateFromView();
    // this.setState({center});
  }
  renderAnnotations() {
    const {direction} = this.state;
    const items = [];
    console.log('renderRouteAnnotation', direction);
    if (direction == null) {
      return null;
    }
    for (let i = 0; i < direction.length; i++) {
      items.push(this.renderRouteAnnotation(direction[i]));
    }
    return items;
  }
  renderRouteAnnotation(item) {
    console.log('renderRouteAnnotation', item);
    return (
      <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={[item.longitude, item.latitude]}>
        <View style={styles.annotationContainer}>
          <View style={styles.annotationFill} />
        </View>
        <MapboxGL.Callout title="An annotation here!" />
      </MapboxGL.PointAnnotation>
    );
  }
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
        <MapboxGL.Callout title="An annotation here!" />
      </MapboxGL.PointAnnotation>
    );
  }
  //
  renderLine() {
    const {direction} = this.state;
    console.log('renderRouteAnnotation', direction);
    if (direction == null) {
      return null;
    }
    return (
      <MapboxGL.ShapeSource id="mapbox-directions-source" shape={direction}>
        <MapboxGL.LineLayer
          id="mapbox-directions-line"
          //belowLayerID={'store-locator-places-unselected-symbols'}
          style={mapstyles.directionsLine}
        />
      </MapboxGL.ShapeSource>
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
            onRegionDidChange={this.onRegionDidChange}
            showUserLocation={true}
            userTrackingMode={1}
            style={{flex: 1}}>
            <MapboxGL.Camera
              zoomLevel={17}
              centerCoordinate={[longitude, latitude]}
            />
            {this.renderUserAnnotation()}
            {this.renderLine()}
          </MapboxGL.MapView>
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
export default connect(mapStateToProps, dispatchToProps)(MapsBoxComponent);
