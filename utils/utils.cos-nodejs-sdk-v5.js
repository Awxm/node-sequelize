const COS = require('cos-nodejs-sdk-v5');
const { SecretId, SecretKey } = require('../config/cos-nodejs-sdk-v5');
const cos = new COS({
  SecretId,
  SecretKey
});
module.exports = cos;
