module.exports = (sequelize, Sequelize) => {
  const { INTEGER, STRING, BOOLEAN, DATE, BIGINT, UUIDV1, UUIDV4, NOW } = Sequelize;
  return sequelize.define(
    'account',
    {
      id: {
        autoIncrement: true,
        type: BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      auid: {
        type: STRING(36),
        allowNull: false,
        defaultValue: UUIDV4
      },
      nickname: {
        type: STRING(255),
        allowNull: true
      },
      username: {
        type: STRING(255),
        allowNull: true
      },
      enabled: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      countryCode: {
        type: STRING(255),
        allowNull: true
      },
      phone: {
        type: STRING(255),
        allowNull: true
      },
      email: {
        type: STRING(255),
        allowNull: true
      },
      password: {
        type: STRING(255),
        allowNull: true,
        defaultValue: UUIDV1
      },
      workWechatId: {
        type: STRING(255),
        allowNull: true
      },
      gender: {
        type: INTEGER,
        allowNull: true
      },
      avatarUrl: {
        type: STRING(255),
        allowNull: true
      },
      status: {
        type: STRING(255),
        allowNull: false
      },
      invitedBy: {
        type: STRING(255),
        allowNull: true
      },
      inviterId: {
        type: STRING(255),
        allowNull: true
      },
      csAuid: {
        type: STRING(32),
        allowNull: true
      },
      registerTime: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        get(key) {
          return this.getDataValue(key).getTime();
        }
      }
    },
    {
      tableName: 'account'
    }
  );
};
