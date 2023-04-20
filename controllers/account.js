const Models = require('../models');
const Dao = require('../dao');

// 模型参数
const { Account, Op } = Models;
const { ne, substring, or } = Op;

// 获取getInfo的消息
exports.getInfo = async (req, res) => {
  const { auid } = req.body;
  if (!auid) return res.sendExtraResult(null, 'Error');
  // 查询数据库中是否存在
  try {
    const data = await Account.findOne({ where: { auid }, attributes: ['username', 'auid', 'phone', 'avatarUrl'] });
    if (data) {
      const { username } = data;
      return res.sendExtraResult({ ...data.toJSON(), roles: username === 'admin' ? ['admin'] : [] }, 'Success');
    }
    return res.sendExtraResult(null, 'Unify', '该用户不存在');
  } catch (error) {
    return res.sendExtraResult(error, 'Error', '');
  }
};

// 创建
exports.create = async (req, res) => {
  const { username, nickname, phone, password } = req.body;
  if (!(username && nickname && phone && password)) return res.sendExtraResult(null, 'Error');
  try {
    const account = { ...req.body, status: 'pending' };
    const singleCustomer = await Account.create(account);
    res.sendExtraResult(singleCustomer, 'Success');
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// 删除
exports.delete = (req, res) => {
  const { auid } = req.body;
  // 请求验证
  if (!auid) return res.sendExtraResult(null, 'Error');
  Dao.delete(Account, { auid }, () => {
    res.sendExtraResult(null, 'Success');
  });
};

// 更新
exports.update = (req, res) => {
  const { auid } = req.body;
  if (!auid) return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(Account, req.body, { auid }, (data) => {
    res.sendResultAuto(data);
  });
};

// 更新状态
exports.updateStatus = (req, res) => {
  const { auid, enabled } = req.body;
  if (!auid && typeof enabled === 'boolean') return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(Account, req.body, { auid }, (data) => {
    res.sendResultAuto(data);
  });
};

// 查询所有
exports.findAll = async (req, res) => {
  const { keyword } = req.body;
  const conditions = {
    ...req.body,
    where: { username: { [ne]: 'admin' } },
    attributes: { exclude: ['id', 'password'] }
  };
  if ((keyword ?? '') !== '') {
    conditions.where = {
      ...conditions.where,
      [or]: [
        { username: { [substring]: `${keyword}` } },
        { nickname: { [substring]: `${keyword}` } },
        { phone: { [substring]: `${keyword}` } }
      ]
    };
  }
  Dao.list(Account, conditions, (data) => {
    res.sendResultAuto(data);
  });
};

// 查询单挑
exports.findOne = (req, res) => {
  const pm = req.body;
  Dao.findOne(Account, pm, (data) => {
    res.sendResultAuto(data);
  });
};

// 自定义
exports.query = (req, res) => {
  let sql = 'SELECT * FROM `t_account`';
  Dao.doQuery(sql, (data) => {
    res.sendResultAuto(data);
  });
};
