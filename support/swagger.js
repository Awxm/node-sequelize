const expressSwagger = require('express-swagger-generator');
const options = require('../config/swagger');

module.exports = (app) => {
  expressSwagger(app)(options);
};
