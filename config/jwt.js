module.exports = {
  secret: '',
  algorithms: ['HS256'],
  credentialsRequired: true,
  unless: {
    path: ['/api/account/login']
  }
};
