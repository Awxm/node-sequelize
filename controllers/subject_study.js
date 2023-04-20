const Models = require('../models');
const Dao = require('../dao');
const { queryConditions } = require('../utils/utils.tools');
const dictionarty = require('../dictionarty/data.json');
const { send: workWxSend } = require('../workWx/index');

const checkSubjectStatus = dictionarty.find((f) => f.dictCode === 'checkSubjectStatus');
const formalAuditStatus = dictionarty.find((f) => f.dictCode === 'formalAuditStatus');
const medicalReviewStatus = dictionarty.find((f) => f.dictCode === 'medicalReviewStatus');
// 模型参数
const { SubjectStudy, Op, Subject, Study, sequelize } = Models;
const { substring, or } = Op;

Subject.belongsToMany(Study, {
  through: {
    model: SubjectStudy,
    unique: false
  },
  foreignKey: 'subjectId',
  sourceKey: 'subjectId'
});

Study.belongsToMany(Subject, {
  through: {
    model: SubjectStudy,
    unique: false
  },
  foreignKey: 'studyId',
  sourceKey: 'studyId'
});
// 关联关系

SubjectStudy.belongsTo(Study, { as: 'study', foreignKey: 'studyId', targetKey: 'studyId' });
SubjectStudy.belongsTo(Subject, { as: 'subject', foreignKey: 'subjectId', targetKey: 'subjectId' });

// 创建
exports.create = async (req, res) => {
  const { subjectId, studyId } = req.body;
  if (!(subjectId, studyId)) return res.sendExtraResult(null, 'Error');
  // 查询当前是否已经关联该项目 如果没有则同意关联，如果有
  const data = await SubjectStudy.findOne({ where: { subjectId, studyId } });
  if (data) {
    return res.sendExtraResult(null, 'Unify', '该研究已经和受试者关联');
  } else {
    Dao.create(SubjectStudy, req.body, (data) => {
      res.sendResultAuto(data);
      // 微信通知
      workWxSend({
        msgtype: 'text',
        text: {
          content: `募随的通知：新增一个审核\n请登录<a href="http://192.168.31.74:8888/">募随系统管理后台</a>`
        }
      });
    });
  }
};

// 修改状态
exports.subjectStatus = (req, res) => {
  const { id, subjectStatus } = req.body;
  const statusIndex = checkSubjectStatus.items.findIndex((i) => i.itemValue === subjectStatus);
  if (!(id && subjectStatus) || !(statusIndex > -1)) return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(SubjectStudy, { subjectStatus }, { id }, (data) => {
    res.sendResultAuto(data);
  });
};
// 修改形审状态
exports.formalAuditStatus = (req, res) => {
  const { id, remark, status } = req.body;
  const statusIndex = formalAuditStatus.items.findIndex((i) => i.itemValue === status);
  if (!(id && status) || !(statusIndex > -1)) return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(SubjectStudy, { remark, status }, { id }, (data) => {
    res.sendResultAuto(data);
  });
};
// 修改医学审核状态
exports.medicalReviewStatus = (req, res) => {
  const { id, enrollmentStatus } = req.body;
  const statusIndex = medicalReviewStatus.items.findIndex((i) => i.itemValue === enrollmentStatus);
  if (!(id && enrollmentStatus) || !(statusIndex > -1)) return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(SubjectStudy, { enrollmentStatus }, { id }, (data) => {
    res.sendResultAuto(data);
  });
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
  Dao.list(SubjectStudy, conditions, (data) => {
    res.sendResultAuto(data);
  });
};

// 查询全部
exports.managementAll = async (req, res) => {
  try {
    const { keyword } = req.body;

    const conditions = {
      ...req.body,
      attributes: [
        'id',
        'createTime',
        'status',
        'remark',
        'enrollmentStatus',
        'subjectStatus',
        [sequelize.col('study.study_id'), 'studyId'],
        [sequelize.col('study.name'), 'studyName'],
        [sequelize.col('study.registration_no'), 'registrationNo'],
        [sequelize.col('study.stage'), 'stage'],
        [sequelize.col('subject.name'), 'subjectName'],
        [sequelize.col('subject.phone'), 'phone'],
        [sequelize.col('subject.subject_id'), 'subjectId'],
        [sequelize.col('subject.disease'), 'disease']
      ],
      include: [
        { model: Subject, as: 'subject', attributes: [] },
        { model: Study, as: 'study', attributes: [] }
      ],
      raw: true
    };

    if ((keyword ?? '') !== '') {
      conditions.where = {
        [or]: [
          { '$study.name$': { [substring]: `${keyword}` } },
          { '$study.registration_no$': { [substring]: `${keyword}` } },
          { '$study.stage$': { [substring]: `${keyword}` } },
          { '$subject.name$': { [substring]: `${keyword}` } }
        ]
      };
    }

    const paramet = queryConditions(conditions);
    const { count: total } = await SubjectStudy.findAndCountAll(paramet);
    const data = await SubjectStudy.findAll(queryConditions(conditions));

    return res.sendExtraResult({ data, total }, 'Success');
  } catch (error) {
    return res.sendExtraResult(error, 'Unify', '获取数据异常');
  }
};
// 查询形审列表
exports.formalAll = async (req, res) => {
  try {
    const { keyword } = req.body;

    const conditions = {
      ...req.body,
      attributes: [
        'id',
        'createTime',
        'status',
        'remark',
        'enrollmentStatus',
        'subjectStatus',
        [sequelize.col('study.study_id'), 'studyId'],
        [sequelize.col('study.name'), 'studyName'],
        [sequelize.col('study.registration_no'), 'registrationNo'],
        [sequelize.col('study.stage'), 'stage'],
        [sequelize.col('subject.name'), 'subjectName'],
        [sequelize.col('subject.phone'), 'phone'],
        [sequelize.col('subject.subject_id'), 'subjectId'],
        [sequelize.col('subject.disease'), 'disease']
      ],
      include: [
        { model: Subject, as: 'subject', attributes: [] },
        { model: Study, as: 'study', attributes: [] }
      ],
      raw: true
    };

    if ((keyword ?? '') !== '') {
      conditions.where = {
        [or]: [
          { '$study.name$': { [substring]: `${keyword}` } },
          { '$study.registration_no$': { [substring]: `${keyword}` } },
          { '$study.stage$': { [substring]: `${keyword}` } },
          { '$subject.name$': { [substring]: `${keyword}` } }
        ]
      };
    }

    const paramet = queryConditions(conditions);
    const { count: total } = await SubjectStudy.findAndCountAll(paramet);
    const data = await SubjectStudy.findAll(queryConditions(conditions));

    return res.sendExtraResult({ data, total }, 'Success');
  } catch (error) {
    return res.sendExtraResult(error, 'Unify', '获取数据异常');
  }
};
// 医学审核
exports.enrollmentAll = async (req, res) => {
  try {
    const { keyword } = req.body;
    const conditions = {
      ...req.body,
      where: {
        status: 'complete'
      },
      attributes: [
        'id',
        'createTime',
        'status',
        'remark',
        'enrollmentStatus',
        'subjectStatus',
        [sequelize.col('study.study_id'), 'studyId'],
        [sequelize.col('study.name'), 'studyName'],
        [sequelize.col('study.registration_no'), 'registrationNo'],
        [sequelize.col('study.stage'), 'stage'],
        [sequelize.col('subject.name'), 'subjectName'],
        [sequelize.col('subject.phone'), 'phone'],
        [sequelize.col('subject.subject_id'), 'subjectId'],
        [sequelize.col('subject.disease'), 'disease']
      ],
      include: [
        { model: Subject, as: 'subject', attributes: [] },
        { model: Study, as: 'study', attributes: [] }
      ],
      raw: true
    };

    if ((keyword ?? '') !== '') {
      conditions.where = {
        ...conditions.where,
        [or]: [
          { '$study.name$': { [substring]: `${keyword}` } },
          { '$study.registration_no$': { [substring]: `${keyword}` } },
          { '$study.stage$': { [substring]: `${keyword}` } },
          { '$subject.name$': { [substring]: `${keyword}` } }
        ]
      };
    }

    const paramet = queryConditions(conditions);
    const { count: total } = await SubjectStudy.findAndCountAll(paramet);
    const data = await SubjectStudy.findAll(queryConditions(conditions));

    return res.sendExtraResult({ data, total }, 'Success');
  } catch (error) {
    return res.sendExtraResult(error, 'Unify', '获取数据异常');
  }
};
