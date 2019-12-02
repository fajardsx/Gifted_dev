import axios from './axios_lib';
import API from './common/api';
import errorHandling from './common/index';
import Constants from './../configs/constant';

export function postRegister(post, callback) {
  axios.post(API.REGISTER);
}
export function postLogin(post, callback) {
  console.log(axios.defaults.baseURL);
  console.log(post);

  axios
    .post(API.LOGIN, post)
    .then(response => {
      console.log('services.js => login response', response);
      callback(response);
    })
    .catch(errorHandling);
}

//SUBMIT POST

export function callGet(_resturl, onComplete) {
  // let data = new FormData();
  let didTimeOut = false;
  //data.append("user_id", user.getUsId());
  let _url = Constants.REST + _resturl;
  console.log(_url);
  new Promise((resolve, reject) => {
    const Timeout = setTimeout(() => {
      didTimeOut = true;
      callToast('Server Request Time Out');
      clearTimeout(Timeout);
      reject(new Error('Request Time Out'));
    }, Constants.TIME_OUT);

    fetch(_url, {
      method: Constants.G,
      headers: Constants.HEADER_GET,
      //body: data
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(responsetext => {
        clearTimeout(Timeout);
        if (!didTimeOut) {
          console.log('success', responsetext);
          resolve(responsetext);
        }
      })
      .catch(error => {
        callToast(String(error));
        if (didTimeOut) return;
        clearTimeout(Timeout);
        reject(error);
      });
  })
    .then(res => {
      console.log('success', res);
      onComplete(res);
    })
    .catch(err => {
      onComplete(null);
      console.log('Request Err', err);
    });
}
export function callPost(_resturl, form, onComplete) {
  // let data = new FormData();
  let didTimeOut = false;

  let _url = Constants.REST + _resturl;
  console.log(_url);
  new Promise((resolve, reject) => {
    const Timeout = setTimeout(() => {
      didTimeOut = true;
      //callToast('Server Request Time Out')
      clearTimeout(Timeout);
      reject(new Error('Request Time Out'));
    }, Constants.TIME_OUT);

    fetch(_url, {
      method: Constants.P,
      headers: Constants.HEADER_POST,
      body: form,
    })
      .then(response => response.json())
      .then(responsetext => {
        clearTimeout(Timeout);
        if (!didTimeOut) {
          console.log('success', responsetext);
          resolve(responsetext);
        }
      })
      .catch(error => {
        //callToast(String(error));
        if (didTimeOut) return;
        clearTimeout(Timeout);
        reject(error);
      });
  })
    .then(res => {
      console.log('success', res);
      onComplete(res);
    })
    .catch(err => {
      onComplete(null);
      console.log('Request Err', err);
    });
}
