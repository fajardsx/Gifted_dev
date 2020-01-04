/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid,
} from 'react-native';
import NavigationView from './NavigationView';
import {NativeModules} from 'react-native';
import {withNavigationFocus} from 'react-navigation';

type Props = {};
class Navigator extends Component<Props> {
  state = {
    granted: Platform.OS === 'ios',
    fromLat: -6.203356,
    fromLong: 106.766962,
    toLat: -6.202312,
    toLong: 106.769182,
  };

  componentDidMount() {
    if (!this.state.granted) {
      this.requestFineLocationPermission();
    }
    this.focuslistener = this.props.navigation.addListener('didFocus', () => {
      console.log('INDEX NAVIGATOR FOCUED');
    });
  }
  openMap() {
    const {granted, fromLat, fromLong, toLat, toLong} = this.state;
    NativeModules.MapboxNavigation.navigate(fromLat, fromLong, toLat, toLong);
  }
  async requestFineLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'ACCESS_FINE_LOCATION',
          message: 'Mapbox navigation needs ACCESS_FINE_LOCATION',
        },
      );

      console.log('navigation/index.js => granted ', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({granted: true}, () => {
          //this.openMap();
        });
      } else {
        console.log('ACCESS_FINE_LOCATION permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    const {granted, fromLat, fromLong, toLat, toLong} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <Text style={styles.welcome}>Loading Navigator</Text>
          {granted && (
            <NavigationView
              style={styles.navigation}
              destination={{
                lat: toLat,
                long: toLong,
              }}
              origin={{
                lat: fromLat,
                long: fromLong,
              }}
            />
          )}
        </View>

        {/* <View style={styles.subcontainer}>
          {Platform.OS === 'android' && (
            <Button
              title={'Start Navigation'}
              onPress={() => {
                NativeModules.MapboxNavigation.navigate(
                  fromLat,
                  fromLong,
                  toLat,
                  toLong,
                );
              }}
            />
          )}
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'whitesmoke',
  },
  subcontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'whitesmoke',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  navigation: {
    backgroundColor: 'gainsboro',
    flex: 1,
  },
});

export default withNavigationFocus(Navigator);
