import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import Constants from '../configs/constant';

const clientoptions = {accessToken: Constants.MAPBOX_KEYS};
const directionClient = MapboxDirectionsFactory(clientoptions);

export {directionClient};
