module.exports = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'musui_ctrm',
  dateStrings: true,
  dialect: 'mysql',

  timezone: '+08:00', // 东八时区
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'createTime', // 关闭createdAt
    updatedAt: 'updateTime' // 开启updatedA
  }
};
