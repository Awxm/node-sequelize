const Models = require('../models');
const Dao = require('../dao');
const { uploadArray } = require('../utils/utils.upload');
const { deleteNullObj } = require('../utils/utils.tools');
const _ = require('lodash');
// 模型参数
const { MedicalHistory, CloudFile, Op } = Models;
const { substring, or, eq, notIn, and } = Op;
// 一个对多个
MedicalHistory.hasMany(CloudFile, { as: 'cloudFiles', foreignKey: 'moduleId', sourceKey: 'historyId' });
// 多个输出一个
CloudFile.belongsTo(MedicalHistory, { foreignKey: 'moduleId', sourceKey: 'historyId' });

const currentModule = {
  moduleType: 'subject',
  groupName: 'history'
};

// 创建
exports.create = async (req, res) => {
  try {
    const { files, body } = await uploadArray(req, res, 'files', 9);

    const { historyContent, caseTime, subjectId } = body;
    if (!(historyContent && caseTime && subjectId)) res.sendExtraResult(null, 'Error');
    // 插入一个病史
    const singleMedicalHistory = await MedicalHistory.create(deleteNullObj(body));
    const { historyId } = singleMedicalHistory;
    // 文件列表
    const filesBulkCreate = [];
    for (let index = 0; index < files.length; index++) {
      const { mimetype, path, size, originalname } = files[index];
      const element = {
        ...currentModule,
        moduleId: historyId,
        contentType: mimetype,
        fileUrl: path,
        fileName: originalname,
        size
      };
      filesBulkCreate.push(element);
    }
    const cloudFiles = await CloudFile.bulkCreate(filesBulkCreate);
    res.sendExtraResult({ singleMedicalHistory, cloudFiles }, 'Success');
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// 删除
exports.delete = async (req, res) => {
  const { subjectId, historyId } = req.body;
  if (!(subjectId && historyId)) return res.sendExtraResult(null, 'Error');
  // 删除关联的照片
  try {
    await MedicalHistory.destroy({ where: { subjectId, historyId } });
    const data = await CloudFile.destroy({ where: { moduleId: historyId } });
    res.sendExtraResult(data, 'Success');
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// 更新
exports.update = async (req, res) => {
  try {
    const { files, body } = await uploadArray(req, res, 'files', 9);
    const { historyContent, caseTime, subjectId, historyId, cloudFiles } = body;
    const jsonCloudFiles = JSON.parse(cloudFiles);

    // 参数判断
    if (!(historyId && subjectId)) res.sendExtraResult(null, 'Error');

    // 文件列表
    await MedicalHistory.update({ caseTime, historyContent }, { where: { historyId } });

    if (jsonCloudFiles.length === 0 || !jsonCloudFiles) {
      // 删除所有moduleId === historyId 的图片
      await CloudFile.destroy({
        where: { moduleId: { [eq]: historyId }, ...currentModule }
      });
    } else {
      // 没有传fileId的全部删除
      const map = _.map(jsonCloudFiles, 'fileId');
      await CloudFile.destroy({
        where: {
          [and]: [{ fileId: { [notIn]: map } }, { moduleId: { [eq]: historyId } }, currentModule]
        }
      });
    }

    // 最后写文件到数据库
    const filesBulkCreate = [];
    if (files.length !== 0) {
      for (let index = 0; index < files.length; index++) {
        const { mimetype, path, size, originalname } = files[index];
        filesBulkCreate.push({
          ...currentModule,
          moduleId: historyId,
          contentType: mimetype,
          fileUrl: path,
          fileName: originalname,
          size
        });
      }
      await CloudFile.bulkCreate(filesBulkCreate);
    }

    res.sendExtraResult(null, 'Success');
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// 查询所有
exports.findAll = async (req, res) => {
  const { keyword, subjectId } = req.body;
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  try {
    const conditions = {
      ...req.body,
      raw: false,
      attributes: { exclude: ['id'] },
      include: [
        {
          model: CloudFile,
          as: 'cloudFiles',
          attributes: [['file_name', 'name'], 'fileId', 'contentType', 'fileUrl', 'size', 'remark']
        }
      ]
    };
    if (subjectId) conditions.where = { subjectId };
    if ((keyword ?? '') !== '') {
      conditions.where = {
        [or]: [{ historyContent: { [substring]: `${keyword}` } }]
      };
    }
    Dao.list(MedicalHistory, conditions, (data) => {
      res.sendResultAuto(data);
    });
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// TODO:缺少删除图片的逻辑,后面在补一个上去
