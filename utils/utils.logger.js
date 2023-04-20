const log4js = require('../support/log4js');

/**
 * 日志输出 level为bug
 * @param { string } content
 */
exports.debug = (content) => {
  let logger = log4js.getLogger('debug');
  logger.level = 'debug';
  logger.debug(content);
};

/**
 * 日志输出 level为info
 * @param { string } content
 */
exports.info = (content) => {
  let logger = log4js.getLogger('info');
  logger.level = 'info';
  logger.info(content);
};

/**
 * 日志输出 level为error
 * @param { string } content
 */
exports.error = (content) => {
  let logger = log4js.getLogger('error');
  logger.level = 'error';
  logger.error(content);
};
