const Models = require('../models');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

// 模型参数
const { Account } = Models;

// 登录
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) return res.sendExtraResult(null, 'Error', '账号或密码错误');
  // 查询数据库中是否存在
  try {
    const data = await Account.findOne({
      where: { username, password },
      attributes: ['username', 'auid', 'phone', 'avatarUrl']
    });
    if (data) {
      const token = jwt.sign({ username, password }, secret, {
        expiresIn: 3600 * 24 * 3 // 3天
      });
      res.header('set-cookie', `token=${token};path=/;domain=localhost;max-age=3600`);
      return res.sendExtraResult({ ...data.toJSON(), token }, 'Success');
    }
    return res.sendExtraResult(null, 'Unify', '账号或密码错误');
  } catch (error) {
    return res.sendExtraResult(null, 'Error');
  }
};
