const { database, host, user, password, dialect, pool, timezone, define } = require('../config/db.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect,
  timezone,
  pool,
  define
});

const db = {};

db.Sequelize = Sequelize; // 引入
db.sequelize = sequelize; // 实例
db.Op = Op; // 操作符

// 用户表
db.Account = require('./account')(sequelize, Sequelize);
db.CancerSubType = require('./cancerSubType')(sequelize, Sequelize);
db.CancerTypeGroup = require('./cancerTypeGroup')(sequelize, Sequelize);
db.CloudFile = require('./cloudFile')(sequelize, Sequelize);
db.ExclusionCriteria = require('./exclusionCriteria')(sequelize, Sequelize);
db.InclusionCriteria = require('./inclusionCriteria')(sequelize, Sequelize);
db.Study = require('./study')(sequelize, Sequelize);
db.StudySite = require('./studySite')(sequelize, Sequelize);
db.Subject = require('./subject')(sequelize, Sequelize);
db.SubjectStudy = require('./subjectStudy')(sequelize, Sequelize);
db.MedicalHistory = require('./medicalHistory')(sequelize, Sequelize);

module.exports = db;
