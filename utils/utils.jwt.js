const { expressjwt } = require('express-jwt');
const { secret, algorithms, credentialsRequired, unless } = require('../config/jwt');

exports.tokenAuth = expressjwt({
  secret,
  algorithms,
  credentialsRequired
}).unless(unless);
