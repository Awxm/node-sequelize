const log4js = require('log4js');
const configure = require('../config/log4js.js');
log4js.configure(configure);

module.exports = log4js;
