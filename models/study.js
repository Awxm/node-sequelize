module.exports = function (sequelize, Sequelize) {
  const { STRING, DATE, BIGINT, TEXT, DECIMAL, DOUBLE, UUIDV4 } = Sequelize;
  return sequelize.define(
    'study',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      studyId: {
        type: STRING(255),
        allowNull: true,
        comment: '研究ID',
        defaultValue: UUIDV4
      },
      name: {
        type: STRING(255),
        allowNull: true,
        comment: '试验名称'
      },
      introduction: {
        type: TEXT,
        allowNull: true,
        comment: '介绍'
      },
      registrationNo: {
        type: STRING(255),
        allowNull: true,
        comment: '登记号'
      },
      therapeuticSchedule: {
        type: TEXT,
        allowNull: true,
        comment: '治疗方案'
      },
      stage: {
        type: STRING(255),
        allowNull: true,
        comment: '试验分期'
      },
      purpose: {
        type: TEXT,
        allowNull: true,
        comment: '试验目的'
      },
      protocolNo: {
        type: STRING(255),
        allowNull: true,
        comment: '项目编号'
      },
      protocolType: {
        type: STRING(255),
        allowNull: true,
        comment: '方案类型'
      },
      protocolVersion: {
        type: STRING(255),
        allowNull: true,
        comment: '版本'
      },
      sponsor: {
        type: STRING(255),
        allowNull: true,
        comment: '申办方'
      },
      principalInvestigator: {
        type: STRING(255),
        allowNull: true,
        comment: '主要研究者'
      },
      plannedStartDate: {
        type: DATE,
        allowNull: true,
        comment: '研究开始时间'
      },
      plannedEndDate: {
        type: DATE,
        allowNull: true,
        comment: '研究结束时间'
      },
      expectedEnrollment: {
        type: TEXT('tiny'),
        allowNull: true,
        comment: '入组人数'
      },
      actualEnrollment: {
        type: TEXT('tiny'),
        allowNull: true,
        comment: '当前入组人数'
      },
      progress: {
        type: DOUBLE,
        allowNull: true,
        comment: '进度'
      },
      recruitmentFee: {
        type: DECIMAL(10, 2),
        allowNull: true,
        comment: '招募费用'
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
      }
    },
    {
      tableName: 'study'
    }
  );
};
