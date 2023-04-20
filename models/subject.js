module.exports = (sequelize, Sequelize) => {
  const { STRING, DATE, BIGINT, UUIDV4, INTEGER } = Sequelize;
  return sequelize.define(
    'subject',
    {
      id: {
        autoIncrement: true,
        type: BIGINT,
        allowNull: false,
        primaryKey: true
      },
      subjectId: {
        type: STRING(225),
        allowNull: true,
        comment: 'subjectIdID',
        defaultValue: UUIDV4
      },
      subjectNo: {
        type: STRING(225),
        allowNull: true,
        comment: '病历号',
        defaultValue: UUIDV4
      },
      siteId: {
        type: STRING(225),
        allowNull: true,
        comment: '学位号'
      },
      secrecy: {
        type: STRING(225),
        allowNull: true,
        comment: '性别'
      },
      name: {
        type: STRING(255),
        allowNull: true,
        comment: '姓名'
      },
      acronym: {
        type: STRING(255),
        allowNull: true,
        comment: '首字母缩写'
      },
      age: {
        type: INTEGER,
        allowNull: true,
        comment: '年龄'
      },
      birthday: {
        type: DATE,
        allowNull: true,
        comment: '出生日期'
      },
      wechatName: {
        type: STRING(255),
        allowNull: true,
        comment: '微信名字'
      },
      wechatId: {
        type: STRING(225),
        allowNull: true,
        comment: '微信ID'
      },
      phone: {
        type: STRING(255),
        allowNull: true,
        comment: '手机号'
      },
      source: {
        type: STRING(255),
        allowNull: true,
        comment: '来源'
      },
      province: {
        type: STRING(255),
        allowNull: true,
        comment: '省'
      },
      city: {
        type: STRING(255),
        allowNull: true,
        comment: '市'
      },
      county: {
        type: STRING(255),
        allowNull: true,
        comment: '县'
      },
      address: {
        type: STRING(255),
        allowNull: true,
        comment: '详细地址'
      },
      intentionProvince: {
        type: STRING(255),
        allowNull: true,
        comment: '意向省份'
      },
      intentionCity: {
        type: STRING(255),
        allowNull: true,
        comment: '意向市'
      },
      disease: {
        type: STRING(255),
        allowNull: true,
        comment: '病种/癌肿'
      },
      diseaseSn: {
        type: INTEGER,
        allowNull: true,
        comment: '病种流水号'
      },
      stage: {
        type: STRING(255),
        allowNull: true,
        comment: '疾病分期'
      },
      ecog: {
        type: STRING(255),
        allowNull: true,
        comment: 'ECOG评分'
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
      tableName: 'subject'
    }
  );
};
