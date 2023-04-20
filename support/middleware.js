const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mount = require('mount-routes');
const UnifiedResponse = require('../utils/utils.resextra');
const { tokenAuth } = require('../utils/utils.jwt');
const swagger = require('./swagger');

module.exports = (app) => {
  // 处理请求参数解析
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: false }));

  // 解决跨域
  app.use(cors());
  // 设置跨域和相应数据格式
  app.all('/api/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, token');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization');
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') res.send(200);
    else next();
  });

  app.use(tokenAuth);

  app.use(cookieParser()); // 定义使用 cookie 处理对象

  app.use(express.static(path.join(__dirname, 'public'))); // 定义静态资源目录 public

  app.use(UnifiedResponse); // 统一响应机制

  // 带路径的用法并且可以打印出路由表  true 代表展示路由表在打印台
  mount(app, path.join(process.cwd(), '/routes'), true);

  swagger(app);
};
