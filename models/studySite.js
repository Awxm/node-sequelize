module.exports = function (sequelize, Sequelize) {
  const { STRING, DATE, BIGINT, UUIDV4, UUID } = Sequelize;
  return sequelize.define(
    'study_site',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      siteId: {
        type: STRING(255),
        allowNull: true,
        comment: UUID,
        defaultValue: UUIDV4
      },
      studyId: {
        type: STRING(255),
        allowNull: true,
        comment: UUID,
        defaultValue: UUIDV4
      },
      siteName: {
        type: STRING(255),
        allowNull: true,
        comment: '中心名称'
      },
      principalInvestigator: {
        type: STRING(255),
        allowNull: true,
        comment: '主要研究者'
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
      enrollmentStartDate: {
        type: DATE,
        allowNull: true,
        comment: '招募开始时间'
      },
      enrollmentEndDate: {
        type: DATE,
        allowNull: true,
        comment: '招募结束时间'
      }
    },
    {
      tableName: 'study_site'
    }
  );
};
