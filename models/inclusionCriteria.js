module.exports = function (sequelize, Sequelize) {
  const { STRING, BIGINT, TEXT, UUIDV4 } = Sequelize;
  return sequelize.define(
    'inclusion_criteria',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      inclusionCriteriaId: {
        type: STRING(255),
        allowNull: true,
        defaultValue: UUIDV4
      },
      studyId: {
        type: STRING(255),
        allowNull: true
      },
      content: {
        type: TEXT,
        allowNull: true
      },
      position: {
        type: TEXT('tiny'),
        allowNull: true
      }
    },
    {
      tableName: 'inclusion_criteria'
    }
  );
};
