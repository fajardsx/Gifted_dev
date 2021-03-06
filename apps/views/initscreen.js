import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles';
//REDUX
import {connect} from 'react-redux';
import ACTION_TYPE from '../redux/actions/actions';
import VoicesComponent from '../components/Voices';
//import MapsComponent from '../components/Maps';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapsBoxComponent from './../components/Mapsbox';

class InitScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissiongrand: false,
    };
  }
  componentDidMount() {
    //this.onCheckPermission();
    this.setState({permissiongrand: true});
    console.log('token ', this.props.token);

    if (this.props.token) {
      this.props.navigation.navigate('inappscreen');
    } else {
      this.props.navigation.navigate('titlescreen');
    }
  }
  //EVENT
  onCheckPermission() {
    // check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    //   .then(result => {
    //     switch (result) {
    //       case RESULTS.UNAVAILABLE:
    //         console.log(
    //           'This feature is not available (on this device / in this context)',
    //         );
    //         break;
    //       case RESULTS.DENIED:
    //         console.log(
    //           'The permission has not been requested / is denied but requestable',
    //         );
    //         break;
    //       case RESULTS.GRANTED:
    //         console.log('The permission is granted');
    //         this.setState({permissiongrand: true});
    //         break;
    //       case RESULTS.BLOCKED:
    //         console.log('The permission is denied and not requestable anymore');
    //         break;
    //     }
    //   })
    //   .catch(error => console.log(error));
  }
  //RENDER
  render() {
    const {permissiongrand} = this.state;
    return (
      <View style={styles.container}>
        {/* {permissiongrand == true && <MapsBoxComponent />}
        <VoicesComponent /> */}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    friendlist: state.friendlist,
    token: state.token,
  };
}
export default connect(mapStateToProps)(InitScreen);
