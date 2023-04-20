// 1. 引入依赖
const multer = require('multer');
const path = require('path');

// 2. 封装处理路径函数
const handlePath = (dir) => path.join(__dirname, './', dir);

// 3. 设置 multer 的配置对象
const storage = multer.diskStorage({
  // 3.1 存储路径
  destination: function (req, file, cb) {
    cb(null, handlePath('../uploads_files'));
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    //   cb(null, handlePath('../../public'));
    // } else {
    //   cb({ error: '仅支持 jpg/png/gif 格式的图片！' });
    // }
  },
  //  3.2 存储名称
  filename: function (req, file, cb) {
    const { originalname } = file;
    // 将图片名称分割伪数组，用于截取图片的后缀
    // const fileFormat = originalname.split('.');
    // 自定义图片名称
    // const ext = fileFormat[fileFormat.length - 1];

    cb(null, `${Date.now()}-${originalname}`);
  }
});

// 4. 为 multer 添加配置
const multerConfig = multer({
  fileFilter(req, file, callback) {
    // 解决中文名乱码的问题 latin1 是一种编码格式
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    callback(null, true);
  },
  storage
});

module.exports = multerConfig;
