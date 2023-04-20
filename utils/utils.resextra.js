// 添加统一的返回结果方法
const { resExtra } = require('./utils.codes');
// 引入日志模块
const logger = require('./utils.logger');

module.exports = function (req, res, next) {
  const { url, method, body, headers } = req;
  const { statusCode } = res;
  const ip = headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.info(
    `ip:${ip},req-url:${url},headers:${JSON.stringify(headers)}, method:${method},params: ${JSON.stringify(body)}`
  ); // 监听post请求

  res.sendResultAuto = function (obj) {
    logger.info(`statusCode:${statusCode},data:${JSON.stringify(obj)}`);
    res.json(obj);
  };

  res.sendExtraResult = function (data, meta, unifyMessage) {
    const obj = resExtra(data, meta, unifyMessage);
    logger.info(`statusCode:${statusCode},data:${JSON.stringify(obj)}`);
    res.json(obj);
  };

  res.sendResult = function (data, code, message) {
    const obj = { data, code, message };
    logger.info(`statusCode:${statusCode},data:${JSON.stringify(obj)}`);
    res.json(obj);
  };

  res.sendRender = function (h, context) {
    const obj = { h, context };
    logger.info(`statusCode:${statusCode},data:${JSON.stringify(obj)}`);
    res.render(h, context);
  };

  // 响应回去
  next();
};
