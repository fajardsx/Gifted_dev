class Constants {
  static COPYRIGHT = 'Copyright ©  2019';
  static NAME_APPS = 'Gifted';
  //VERSION
  static APP_VERSION = '1';
  static APP_STATUS = '';
  static SERVER_APP_VERSION = '0.0.1';
  static FORCE_UPDATE = 'no';
  //API METHOD
  static P = 'POST';
  static G = 'GET';
  static PU = 'PUTS';
  //MAP KEY
  static MAP_KEYS = 'AIzaSyBn9fVaS7-t3m7F1oVbytt3xa3raHf6B6U'; //AIzaSyBdRkVZ941mf3epa2PRWQUid2QBwatwtlU';
  static MAPBOX_KEYS =
    'pk.eyJ1IjoiZmFqYXJkc3giLCJhIjoiY2p1c202b3VpNDg3MjQzbnEydmV5bGJmNCJ9.rcCsymvwj6ubuu6gqUPJ5Q';
  //LOCALE
  static ID = 'id-IN';
  static ENG = 'en-US';
  static LOCALE = this.ID;
  //Header
  static HEADER_1 = {
    'X-Requested-With': 'XMLHttpRequest',
  };
  //Rest
  static SERVER_ID = 1; //DEBUG USE 0
  static HEADER_GET = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Cache-Control': 'no-cache',
  };
  static HEADER_POST = {
    Accept: 'application/javascript',
    'Content-Type': 'multipart/form-data',
  };
  //REST URL
  static REST = 'https://preview.digify.us/gifted/api/';
  //REST TIMEOUT
  static TIME_OUT = 10000;
  //COMMAD
  static COMMAND_CARI = 1;
  static COMMAND_TAMBAH = 2;
  //DEBUG
  static DEV_MODE = false;
}

export default Constants;
