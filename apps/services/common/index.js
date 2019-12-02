export function errorHandling(error, callback) {
  console.log('ERROR ', error.message);
  callback(null);
}
