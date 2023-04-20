module.exports = (sequelize, Sequelize) => {
  const { STRING, DATE, BIGINT, UUIDV4, NOW, UUID, TEXT } = Sequelize;
  return sequelize.define(
    'subject_study',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      subjectId: {
        type: UUID,
        allowNull: true,
        comment: '受试者ID',
        defaultValue: UUIDV4
      },
      studyId: {
        type: UUID,
        allowNull: true,
        comment: '项目ID',
        defaultValue: UUIDV4
      },
      remark: {
        type: TEXT,
        allowNull: true,
        comment: '备注'
      },
      status: {
        type: STRING(255),
        allowNull: true,
        comment: '申请状态',
        defaultValue: ''
      },
      subjectStatus: {
        type: STRING(255),
        allowNull: true,
        comment: '受试者状态',
        defaultValue: ''
      },
      enrollmentStatus: {
        type: STRING(255),
        allowNull: true,
        comment: '入组状态',
        defaultValue: ''
      },
      updateTime: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        get(key) {
          return this.getDataValue(key).getTime();
        }
      },
      createTime: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        get(key) {
          return this.getDataValue(key).getTime();
        }
      }
    },
    {
      tableName: 'subject_study'
    }
  );
};
