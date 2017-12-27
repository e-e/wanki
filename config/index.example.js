// change this file to 'index.js'
var dataDir = '';
try {
  var path = require('path');
  dataDir = path.join(__dirname, '../data');
} catch (e) {
  try {
    var fs = require('fs');
    dataDir = fs.absolute('../data');
  } catch (ex) {}
}
module.exports = {
  wk_username: '',
  wk_password: '',
  dataDir: dataDir
};
