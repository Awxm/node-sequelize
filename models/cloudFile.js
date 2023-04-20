module.exports = function (sequelize, Sequelize) {
  const { STRING, BIGINT, TEXT, UUIDV4 } = Sequelize;
  return sequelize.define(
    'cloud_file',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      fileId: {
        type: STRING(255),
        allowNull: true,
        comment: '文件ID',
        defaultValue: UUIDV4
      },
      moduleType: {
        type: STRING(255),
        allowNull: true,
        comment: '模块类型'
      },
      moduleId: {
        type: STRING(255),
        allowNull: true,
        comment: '模块的ID'
      },
      groupName: {
        type: STRING(255),
        allowNull: true,
        comment: '模块类分组'
      },
      contentType: {
        type: STRING(255),
        allowNull: true,
        comment: '文件类型'
      },
      fileUrl: {
        type: STRING(255),
        allowNull: true,
        comment: '文件地址'
      },
      fileName: {
        type: STRING(255),
        allowNull: true,
        comment: '文件名称'
      },
      size: {
        type: BIGINT,
        allowNull: true,
        comment: '文件大小'
      },
      remark: {
        type: TEXT,
        allowNull: true,
        comment: '备注'
      },
      status: {
        type: STRING(255),
        allowNull: true,
        comment: '状态'
      },
      createBy: {
        type: STRING(255),
        allowNull: true,
        comment: '添加人'
      }
    },
    {
      tableName: 'cloud_file'
    }
  );
};
