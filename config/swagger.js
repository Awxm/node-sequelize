const options = {
  swaggerDefinition: {
    info: {
      title: 'aidi-api',
      version: '1.0.0',
      description: `aidi-recruitment-project-management`
    },
    host: `${process.env.SWEG_URL}:${process.env.DEV_PORT}`,
    basePath: '/',
    produces: ['application/json', 'application/xml'],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: ''
      }
    }
  },
  route: {
    url: '/swagger', // 打开swagger文档页面地址
    docs: '/swagger.json' // swagger文件 api
  },
  basedir: __dirname, // app absolute path

  files: ['../routes/**/*.js'] // Path to the API handle folder
};
module.exports = options;
