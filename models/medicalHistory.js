module.exports = function (sequelize, Sequelize) {
  const { STRING, BIGINT, DATE, NOW, UUIDV4 } = Sequelize;
  return sequelize.define(
    'medical_history',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      subjectId: {
        type: STRING(225),
        allowNull: true,
        comment: 'subjectIdID',
        defaultValue: UUIDV4
      },
      historyId: {
        type: STRING(255),
        allowNull: true,
        comment: '病史id',
        defaultValue: UUIDV4
      },
      caseTime: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        comment: '病例时间'
      },
      historyContent: {
        type: STRING(255),
        allowNull: true,
        comment: '病史内容',
        defaultValue: UUIDV4
      }
    },
    {
      tableName: 'medical_history'
    }
  );
};
