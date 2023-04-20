const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./utils/utils.logger');
const db = require('./models');
const middlewareConfig = require('./support/middleware');
const app = express();
dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('express-art-template'));
app.set('view engine', 'html');

db.sequelize.sync();

middlewareConfig(app);

// 定义 404 错误处理
app.use(function (req, res) {
  const { method, baseUrl, path } = req;
  logger.error(
    `${method} ${baseUrl + path} *** 请求：${JSON.stringify({ data: null, code: 404, message: 'Not Found' })}`
  );
  res.status(404).sendResult(null, 404, 'Not Found');
});

// 定义其他错误处理
app.use(function (err, req, res, next) {
  const { message, status, name } = err;
  // 设置 locals ，只在开发环境生效
  const { method, baseUrl, path } = req;
  // 渲染错误页面
  logger.error(
    `name:${name},${method} ${baseUrl + path},响应：${JSON.stringify({ data: null, code: status || 500, message })}`
  );
  res.locals.message = message;
  res.locals.error = process.env.NAME === 'development' ? err : {};
  // 返回错误 http 状态码
  if (name === 'UnauthorizedError') {
    res.status(401).send({ data: null, code: '20400', message: 'Token error' });
  }
  res.status(500).send({ data: null, code: 500, message: 'Server error' });
  next();
});

module.exports = app;
