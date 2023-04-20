const Models = require('../models');
const Dao = require('../dao');

// 模型参数
const { Subject, Op } = Models;
const { substring, or } = Op;

// 创建
exports.create = async (req, res) => {
  const { name, phone, stage, disease, secrecy } = req.body;
  if (!(name && phone && stage && disease && secrecy)) return res.sendExtraResult(null, 'Error');
  Dao.create(Subject, req.body, (data) => {
    res.sendResultAuto(data);
  });
};

// 删除
exports.delete = (req, res) => {
  const { subjectId } = req.body;
  // 请求验证
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  Dao.update(Subject, { status: 'error' }, { subjectId }, (data) => {
    res.sendResultAuto(data);
  });
};

// 更新
exports.update = (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(Subject, req.body, { subjectId }, (data) => {
    res.sendResultAuto(data);
  });
};

// 获取受试者信息
exports.getInfo = async (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  try {
    const data = await Subject.findOne({ where: { subjectId } });
    return res.sendExtraResult(data, 'Success');
  } catch (error) {
    return res.sendExtraResult(error, 'Unify', 'auid异常');
  }
};

// 查询所有
exports.findAll = async (req, res) => {
  const { keyword } = req.body;
  const conditions = {
    ...req.body,
    attributes: { exclude: ['id'] }
  };
  if ((keyword ?? '') !== '') {
    conditions.where = {
      [or]: [
        { subject_no: { [substring]: `${keyword}` } },
        { name: { [substring]: `${keyword}` } },
        { disease: { [substring]: `${keyword}` } },
        { stage: { [substring]: `${keyword}` } },
        { ecog: { [substring]: `${keyword}` } }
      ]
    };
  }
  Dao.list(Subject, conditions, (data) => {
    res.sendResultAuto(data);
  });
};
