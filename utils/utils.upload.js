// 引入配置好的 multerConfig
const multerConfig = require('../config/multer');

module.exports = {
  uploadSingle: (req, res, key) => {
    return new Promise((resolve, reject) => {
      multerConfig.single(key)(req, res, function (err) {
        if (err) {
          // 传递的图片格式错误或者超出文件限制大小，就会reject出去
          reject(err);
        } else {
          const { file, body } = req;
          resolve({ file, body });
        }
      });
    });
  },

  uploadArray: (req, res, key, num) => {
    return new Promise((resolve, reject) => {
      multerConfig.array(key, num)(req, res, function (err) {
        if (err) {
          // 传递的图片格式错误或者超出文件限制大小，就会reject出去
          reject(err);
        } else {
          const { files, body } = req;
          resolve({ files, body });
        }
      });
    });
  },
  uploadFields: (req, res, fields) => {
    return new Promise((resolve, reject) => {
      multerConfig.fields(fields)(req, res, function (err) {
        if (err) {
          // 传递的图片格式错误或者超出文件限制大小，就会reject出去
          reject(err);
        } else {
          const { files, body } = req;
          resolve({ files, body });
        }
      });
    });
  }
};
