module.exports = {
  appenders: {
    console: { type: 'console' },
    info: {
      type: 'file',
      filename: 'logs/info',
      maxLogSize: 1024 * 500, // 一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    error: {
      type: 'file',
      filename: 'logs/error',
      maxLogSize: 1024 * 500, // 一个文件的大小，超出后会自动新生成一个文件
      backups: 2, // 备份的文件数量
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['console', 'info'],
      level: 'debug'
    },
    info: {
      appenders: ['info'],
      level: 'info'
    },
    error: {
      appenders: ['error', 'console'],
      level: 'error'
    }
  }
};
