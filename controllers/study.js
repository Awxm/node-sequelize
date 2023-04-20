const fs = require('fs');
const Models = require('../models');
const Dao = require('../dao');
const { uploadSingle } = require('../utils/utils.upload');
const { deleteNullObj } = require('../utils/utils.tools');
const cos = require('../utils/utils.cos-nodejs-sdk-v5');
const { Bucket, Region } = require('../config/cos-nodejs-sdk-v5');
// 模型参数
const { Study, ExclusionCriteria, InclusionCriteria, StudySite, CloudFile, Op } = Models;
const { substring, or, and, notIn, eq } = Op;

// 一对多
Study.hasMany(ExclusionCriteria, { as: 'exclusionCriteria', foreignKey: 'studyId', sourceKey: 'studyId' });
Study.hasMany(InclusionCriteria, { as: 'inclusionCriteria', foreignKey: 'studyId', sourceKey: 'studyId' });
Study.hasMany(StudySite, { as: 'studySite', foreignKey: 'studyId', sourceKey: 'studyId' });

Study.hasOne(CloudFile, { as: 'cloudFile', foreignKey: 'moduleId', sourceKey: 'studyId' });
CloudFile.belongsTo(Study, { foreignKey: 'moduleId' });

InclusionCriteria.belongsTo(Study, { foreignKey: 'studyId' });
InclusionCriteria.belongsTo(Study, { foreignKey: 'studyId' });
StudySite.belongsTo(Study, { foreignKey: 'studyId', sourceKey: 'studyId' });

const currentModule = {
  moduleType: 'study'
};
// 创建
exports.create = async (req, res) => {
  // introduction,
  // registrationNo,
  // therapeuticSchedule,
  // stage,
  // purpose,
  // protocolNo,
  // protocolType,
  // protocolVersion,
  // sponsor,
  // principalInvestigator,
  // plannedStartDate,
  // plannedEndDate,
  // expectedEnrollment,
  // actualEnrollment,
  // progress,
  // recruitmentFee,
  try {
    const { file, body } = await uploadSingle(req, res, 'file');
    const { name, studySite: studys, exclusionCriteria: exclusion, inclusionCriteria: inclusion } = body;
    const exclusionCriteria = JSON.parse(exclusion);
    const inclusionCriteria = JSON.parse(inclusion);
    const studySite = JSON.parse(studys);
    if (!file) return res.sendExtraResult(null, 'Error');
    if (!name) return res.sendExtraResult(null, 'Error');
    if (exclusionCriteria.length === 0) return res.sendExtraResult(null, 'Error');
    if (inclusionCriteria.length === 0) return res.sendExtraResult(null, 'Error');
    if (studySite.length === 0) return res.sendExtraResult(null, 'Error');
    let studyResult = {};
    let exclusionCriteriaResult = [];
    let inclusionCriteriaResult = [];
    let studySiteResult = [];
    // 创建study
    studyResult = await Study.create(deleteNullObj(body));
    const { studyId } = studyResult;
    // exclusionCriteria
    if (exclusionCriteria.length > 0) {
      const exclusionCriteriaBulk = exclusionCriteria.map((m) => {
        m.studyId = studyId;
        return m;
      });
      exclusionCriteriaResult = await ExclusionCriteria.bulkCreate(exclusionCriteriaBulk);
    }
    // inclusionCriteria
    if (inclusionCriteria.length > 0) {
      const inclusionCriteriaBulk = inclusionCriteria.map((m) => {
        m.studyId = studyId;
        return m;
      });
      inclusionCriteriaResult = await InclusionCriteria.bulkCreate(inclusionCriteriaBulk);
    }
    // studySite
    if (studySite.length > 0) {
      const studySiteBulk = studySite.map((m) => {
        m.studyId = studyId;
        return m;
      });
      studySiteResult = await StudySite.bulkCreate(studySiteBulk);
    }
    // 上传腾讯云写入数据库
    const { mimetype, path, size, originalname } = file;
    const data = await cos.putObject({
      Bucket,
      Region,
      Key: `study/${studyId}/${originalname}`,
      StorageClass: 'STANDARD',
      Body: fs.createReadStream(path),
      ContentLength: size
    });
    if (!data) res.sendExtraResult(null, 'Error', '图片异常');
    // 写入数据库
    const cloudFiles = await CloudFile.create(
      deleteNullObj({
        size,
        groupName: 'study',
        fileUrl: `https://${data.Location}`,
        moduleId: studyId,
        contentType: mimetype,
        fileName: originalname,
        ...currentModule
      })
    ); // 删除本地文件
    if (data && cloudFiles) fs.unlinkSync(path);

    res.sendExtraResult(
      {
        ...studyResult.toJSON(),
        ...cloudFiles.toJSON(),
        studySite: studySiteResult,
        inclusionCriteria: inclusionCriteriaResult,
        exclusionCriteria: exclusionCriteriaResult
      },
      'Success'
    );
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// 删除
exports.delete = (req, res) => {
  const { studyId } = req.body;
  // 请求验证
  if (!studyId) return res.sendExtraResult(null, 'Error');
  Dao.update(Study, { status: 'error' }, { studyId }, (data) => {
    res.sendResultAuto(data);
  });
};

// 更新
exports.update = async (req, res) => {
  // 请求验证
  try {
    const { file, body } = await uploadSingle(req, res, 'file');

    const {
      studyId,
      introduction,
      name,
      therapeuticSchedule,
      registrationNo,
      remark,
      studySite: studys,
      exclusionCriteria: exclusion,
      inclusionCriteria: inclusion
    } = body;

    const exclusionCriteria = JSON.parse(exclusion);
    const inclusionCriteria = JSON.parse(inclusion);
    const studySite = JSON.parse(studys);

    if (!studyId) return res.sendExtraResult(null, 'Error');
    if (exclusionCriteria.length === 0) return res.sendExtraResult(null, 'Error');
    if (inclusionCriteria.length === 0) return res.sendExtraResult(null, 'Error');
    if (studySite.length === 0) return res.sendExtraResult(null, 'Error');

    // 更新study
    const studyResult = await Study.update(
      { introduction, name, therapeuticSchedule, registrationNo, remark },
      { where: { studyId } }
    );

    // 更新入组标准
    const inclusionCriteriaIds = [];

    for (let index = 0; index < inclusionCriteria.length; index++) {
      const { inclusionCriteriaId, studyId: sid } = inclusionCriteria[index];
      if ((inclusionCriteriaId ?? '') !== '') inclusionCriteriaIds.push(inclusionCriteriaId);
      if ((sid ?? '') === '') inclusionCriteria[index].studyId = studyId;
    }

    await InclusionCriteria.destroy({
      where: { [and]: [{ inclusionCriteriaId: { [notIn]: inclusionCriteriaIds } }, { studyId: { [eq]: studyId } }] }
    });

    await InclusionCriteria.bulkCreate(inclusionCriteria, {
      updateOnDuplicate: ['position', 'content']
    });

    // 更新排除标准
    const exclusionCriteriaIds = [];

    for (let index = 0; index < exclusionCriteria.length; index++) {
      const { exclusionCriteriaId, studyId: sid } = exclusionCriteria[index];
      if ((exclusionCriteriaId ?? '') !== '') exclusionCriteriaIds.push(exclusionCriteriaId);
      if ((sid ?? '') === '') exclusionCriteria[index].studyId = studyId;
    }

    await ExclusionCriteria.destroy({
      where: { [and]: [{ exclusionCriteriaId: { [notIn]: exclusionCriteriaIds } }, { studyId: { [eq]: studyId } }] }
    });

    await ExclusionCriteria.bulkCreate(exclusionCriteria, {
      updateOnDuplicate: ['position', 'content']
    });

    // 更新试验中心
    const siteIds = [];

    for (let index = 0; index < studySite.length; index++) {
      const { siteId, studyId: sid } = studySite[index];
      if ((siteId ?? '') !== '') siteIds.push(siteId);
      if ((sid ?? '') === '') studySite[index].studyId = studyId;
    }

    await StudySite.destroy({
      where: { [and]: [{ siteId: { [notIn]: siteIds } }, { studyId: { [eq]: studyId } }] }
    });

    await StudySite.bulkCreate(studySite, {
      updateOnDuplicate: ['siteName', 'principalInvestigator', 'enrollmentEndDate', 'enrollmentStartDate']
    });

    // 上传腾讯云写入数据库
    if (file) {
      // 1、数据库查到这条数据
      const { fileName, fileId } = await CloudFile.findOne({ where: { moduleId: studyId } });
      cos.deleteObject({ Bucket, Region, Key: `study/${studyId}/${fileName}` });
      await CloudFile.destroy({ where: { fileId } });
      // 2、把新文件上传腾讯云插入数据库
      const { mimetype, path, size, originalname } = file;
      const data = await cos.putObject({
        Bucket,
        Region,
        Key: `study/${studyId}/${originalname}`,
        StorageClass: 'STANDARD',
        Body: fs.createReadStream(path),
        ContentLength: size
      });

      if (!data) res.sendExtraResult(null, 'Error', '图片异常');

      // 写入数据库
      await CloudFile.create(
        deleteNullObj({
          size,
          groupName: 'study',
          fileUrl: `https://${data.Location}`,
          moduleId: studyId,
          contentType: mimetype,
          fileName: originalname,
          ...currentModule
        })
      );
      fs.unlinkSync(path);
    }
    res.sendExtraResult({ studyResult }, 'Success');
  } catch (error) {
    res.sendExtraResult(error, 'Error', '');
  }
};

// 获取研究信息
exports.getInfo = async (req, res) => {
  const { studyId } = req.body;
  if (!studyId) return res.sendExtraResult(null, 'Error');
  try {
    const where = { studyId };
    const include = [
      { model: ExclusionCriteria, as: 'exclusionCriteria' },
      { model: InclusionCriteria, as: 'inclusionCriteria' },
      { model: StudySite, as: 'studySite' },
      { model: CloudFile, as: 'cloudFile' }
    ];
    const data = await Study.findOne({ where, include });
    return res.sendExtraResult(data, 'Success');
  } catch (error) {
    return res.sendExtraResult(error, 'Unify', '其他异常');
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
        { name: { [substring]: `${keyword}` } },
        { introduction: { [substring]: `${keyword}` } },
        { therapeuticSchedule: { [substring]: `${keyword}` } },
        { stage: { [substring]: `${keyword}` } },
        { stagprotocolType: { [substring]: `${keyword}` } }
      ]
    };
  }
  Dao.list(Study, conditions, (data) => {
    res.sendResultAuto(data);
  });
};
