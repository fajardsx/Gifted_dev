import axios from 'axios';
import Constants from '../configs/constant';

var instance = axios.create();
instance.defaults.baseURL = 'https://preview.digify.us/gifted/api/';
instance.defaults.timeout = 20000;
instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
instance.defaults.headers.post['Accept'] = 'application/json';

export {instance as default};
