module.exports = function (sequelize, Sequelize) {
  const { STRING, BIGINT, INTEGER } = Sequelize;
  return sequelize.define(
    'cancer_type_group',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      cancer_type_group_id: {
        type: STRING(255),
        allowNull: true
      },
      cn_name: {
        type: STRING(255),
        allowNull: true
      },
      en_name: {
        type: STRING(255),
        allowNull: true
      },
      position: {
        type: INTEGER,
        allowNull: true
      }
    },
    {
      tableName: 'cancer_type_group'
    }
  );
};
