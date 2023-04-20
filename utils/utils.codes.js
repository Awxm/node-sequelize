const utilsCodes = {
  // 单独的code
  Success: { code: '10000', message: '操作成功' },
  Error: { code: '10002', message: '参数异常' },
  Unify: { code: '10500', message: '' },
  SequelizeModelError: { code: '10600', message: 'Sequelize Model Error' },
  AccountId: { code: '10100', message: 'ID不存在！' },
  TokenError: { code: '20400', message: 'token异常' }
};

exports.utilsCodes;

// 整理统一返回格式
exports.resExtra = (data, meta, unifyMessage) => {
  let code, message;
  const { code: utilsCode, message: utilsCodeMessage } = utilsCodes[meta];
  code = utilsCode;
  message = unifyMessage || utilsCodeMessage;
  return { data, code, message };
};
