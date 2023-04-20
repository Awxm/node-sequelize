const db = require('../models/index');
const logger = require('../utils/utils.logger');
const { deleteNullObj, queryConditions } = require('../utils/utils.tools');
const { resExtra } = require('../utils/utils.codes');

const sqlOpt = {
  /**
   * 查询数据总条数
   * @param  {Object}   model       模型实例
   * @param  {Object}   conditions  条件集合
   * @param  {Function} cb          回调函数
   */
  count: (model, conditions, cb) => {
    if (!model) return cb(null, 'SequelizeModelError');
    model
      .findAndCountAll(queryConditions(conditions, 'count'))
      .then((data) => {
        cb(resExtra(data.count));
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(null, 'SequelizeModelError'));
      });
  },

  /**
   * 查询所有数据
   * @param  {Object}   model       模型实例
   * @param  {Object}   conditions  条件集合
   * @param  {Function} cb          回调函数
   */
  list: async (model, conditions, cb) => {
    if (!model) return cb(resExtra(null, 'SequelizeModelError'));
    try {
      const { count: total } = await model.findAndCountAll(queryConditions(conditions, 'count'));
      const data = await model.findAll(queryConditions(conditions));
      cb(resExtra({ total, data }, 'Success'));
    } catch (error) {
      logger.error(JSON.stringify(error));
      cb(resExtra(null, 'SequelizeModelError'));
    }
  },

  /**
   * 更具主键 获取一条数据
   * @param  {Object}   model       模型实例
   * @param  {Object}   conditions  条件集合
   * @param  {Function} cb          回调函数
   */
  findOne: (model, conditions, cb) => {
    if (!model) return cb(resExtra(null, 'SequelizeModelError'));
    /* 根据主键查询一条数据 参数
        conditions:{
            params:{
            id:'123'
            }
         }*/
    if (!conditions.params.id) return cb(resExtra(null, 'errorCode'));
    model
      .findOne(queryConditions(conditions))
      .then((data) => {
        cb(resExtra(data));
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(null, 'SequelizeModelError'));
      });
  },

  /**
   * 创建数据
   * @param  {Object}   model       模型实例
   * @param  {Object}   obj         数据集合
   * @param  {Function} cb          回调函数
   */
  create: (model, obj, cb) => {
    if (!model) return cb(resExtra(null, 'SequelizeModelError'));
    model
      .create(deleteNullObj(obj))
      .then((data) => {
        cb(resExtra(data, 'Success'));
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(err, 'SequelizeModelError'));
      });
  },

  /**
   * 删除某条数据
   * @param  {Object}   model       模型实例
   * @param  {Object}   key         删除条件
   * @param  {Function} cb          回调函数
   */
  delete: (model, key, cb) => {
    /* key={ id:body.id }*/
    if (!model) return cb(resExtra(null, 'SequelizeModelError'));
    model
      .destroy({ where: key })
      .then((data) => {
        if (data) {
          cb(resExtra(data, 'Success'));
        } else {
          cb(resExtra(data, 'AccountId'));
        }
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(null, 'SequelizeModelError'));
      });
  },

  /**
   * 删除整个表数据
   * @param  {Object}   model       模型实例
   * @param  {Function} cb          回调函数
   */
  deleteAll: (model, cb) => {
    if (!model) return cb(resExtra(null, 'SequelizeModelError'));
    model
      .destroy({ where: {}, truncate: false })
      .then((data) => {
        if (!data) {
          cb(resExtra(data, 'Success'));
        } else {
          cb(resExtra(null, 'Error'));
        }
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(null, 'SequelizeModelError'));
      });
  },

  /**
   * 更新数据
   * @param  {Object}   model       模型实例
   * @param  {Object}   obj         数据集合
   * @param  {Object}   key         更新条件
   * @param  {Function} cb          回调函数
   */
  update: (model, obj, key, cb) => {
    /* key={
            id:body.id
        }*/
    if (!model) return cb(resExtra(null, 'SequelizeModelError'));
    model
      .update(deleteNullObj(obj), { where: key })
      .then((data) => {
        if (data[0]) {
          cb(resExtra(null, 'Success'));
        } else {
          cb(resExtra(data, 'Error'));
        }
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(null, 'SequelizeModelError'));
      });
  },

  /**
   * 原始查询
   * @param  {String} sql           原始sql语句
   * @param  {Function} cb          回调函数
   */
  doQuery: (sql, cb) => {
    // sql = 'SELECT * FROM `tutorials`'
    db.sequelize
      .query(sql, { type: db.sequelize.QueryTypes.SELECT })
      .then((data) => {
        cb(resExtra(data, 'Success'));
      })
      .catch((err) => {
        logger.error(JSON.stringify(err));
        cb(resExtra(null, 'SequelizeModelError'));
      });
  }
};

module.exports = sqlOpt;
