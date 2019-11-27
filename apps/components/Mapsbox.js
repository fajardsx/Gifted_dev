import React, {PureComponent} from 'react';
import {Text, View, Alert, Image} from 'react-native';
//Third
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import MapboxGL from '@react-native-mapbox-gl/maps';
//local
import Constants from '../configs/constant';
import Buttons from './Buttons';
import {styles} from '../styles';

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
    //this.onReqUserLocation();
    MapboxGL.setTelemetryEnabled(false);
  }
  // onReqUserLocation() {
  //   try {
  //     let author = Geolocation.requestAuthorization();
  //     this.ReqCurrentLocation();
  //   } catch (error) {
  //     Alert.alert('location', error);
  //   }
  // }
  // ReqCurrentLocation() {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       position =>
  //         this.setState(
  //           {
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //             longitudeDelta: 0.02,
  //             latitudeDelta: 0.02,
  //           },
  //           () => {
  //             this.onGetDirection();
  //           },
  //         ),
  //       error => {
  //         console.log('error', error);
  //         this.onReqUserLocation();
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 15000,
  //         maximumAge: 1000,
  //       },
  //     );
  //   } catch (error) {
  //     Alert.alert('location', error);
  //   }
  // }
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
  async onRegionDidChange() {
    const center = await this._map.getCenter();
    this.setState({center});
  }
  renderAnnotations() {
    const items = [];

    for (let i = 0; i < coordinatesDummy.length; i++) {
      //items.push(this.renderAnnotation(i));
    }

    return items;
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
              zoomLevel={15}
              centerCoordinate={[longitude, latitude]}
            />
            {this.renderAnnotations()}
          </MapboxGL.MapView>
        )}
      </View>
    );
  }
}
