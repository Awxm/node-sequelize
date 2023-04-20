const fs = require('fs');

const Models = require('../models');
const Dao = require('../dao');

const cos = require('../utils/utils.cos-nodejs-sdk-v5');
const { uploadSingle } = require('../utils/utils.upload');
const { deleteNullObj } = require('../utils/utils.tools');

const dictionarty = require('../dictionarty/data.json');
const { Bucket, Region } = require('../config/cos-nodejs-sdk-v5');

const subjectReport = dictionarty.find((f) => f.dictCode === 'subjectReport');
// 模型参数
const { CloudFile } = Models;
const currentModule = {
  moduleType: 'subject'
};
// 创建上传报告
exports.create = async (req, res) => {
  try {
    const { file, body } = await uploadSingle(req, res, 'file');
    const { remark, subjectId, groupName } = body;
    if (!(file && subjectId)) return res.sendExtraResult(null, 'Error');
    // 插入图片数据
    const { mimetype, path, size, originalname } = file;
    // 上传腾讯云
    const data = await cos.putObject({
      Bucket,
      Region,
      Key: `${groupName}/${subjectId}/${originalname}`,
      StorageClass: 'STANDARD',
      Body: fs.createReadStream(path),
      ContentLength: size
    });
    if (!data) res.sendExtraResult(null, 'Error', '图片异常');
    // 写入数据库
    const cloudFiles = await CloudFile.create(
      deleteNullObj({
        size,
        remark,
        groupName,
        fileUrl: `https://${data.Location}`,
        ...currentModule,
        moduleId: subjectId,
        contentType: mimetype,
        fileName: originalname
      })
    );
    // 删除本地文件
    fs.unlinkSync(path);
    res.sendExtraResult(cloudFiles, 'Success');
  } catch (error) {
    res.sendExtraResult(error, 'Error');
  }
};

// 删除
exports.delete = async (req, res) => {
  const { subjectId, fileId } = req.body;
  // 请求验证
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  // 删除关联的照片
  try {
    const { groupName, fileName } = await CloudFile.findOne({ where: { moduleId: subjectId, fileId } });
    await cos.deleteObject({ Bucket, Region, Key: `${groupName}/${fileName}` });
    await CloudFile.destroy({ where: { moduleId: subjectId, fileId } });
    res.sendExtraResult(null, 'Success');
  } catch (error) {
    res.sendExtraResult(null, 'Error', '删除失败');
  }
};

// 更新
exports.update = (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  // 请求验证
  Dao.update(CloudFile, req.body, { subjectId }, (data) => {
    res.sendResultAuto(data);
  });
};

// 查询所有
exports.findAll = async (req, res) => {
  const { subjectId } = req.body;
  if (!subjectId) return res.sendExtraResult(null, 'Error');
  try {
    const data = {};
    const items = subjectReport.items.map((m) => m.itemValue);
    for (let index = 0; index < items.length; index++) {
      const groupName = items[index];
      const result = await CloudFile.findAll({ where: { moduleId: subjectId, groupName } });
      data[groupName] = result;
    }
    res.sendExtraResult(data, 'Success');
  } catch (error) {
    return res.sendExtraResult(null, 'Error');
  }
};
