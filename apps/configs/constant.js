class Constants {
  static COPYRIGHT = 'Copyright ©  2019';
  static NAME_APPS = 'Voice Navi';
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
  static MAP_KEYS = 'AIzaSyBdRkVZ941mf3epa2PRWQUid2QBwatwtlU';
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
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Cache-Control': 'no-cache',
  };
  static HEADER_POST = {
    Accept: 'application/javascript',
    'Content-Type': 'multipart/form-data',
  };
  //REST TIMEOUT
  static TIME_OUT = 10000;
}

export default Constants;
