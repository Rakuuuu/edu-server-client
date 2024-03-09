const Sequelize = require('sequelize');

/**
 * 导入sequelize配置
 * @param databaseName 数据库名称
 * @param account 数据库账户
 * @param password 数据库密码
 * @param databaseConfig 数据库配置
 */
const sequelize = new Sequelize(
  'nodejs',
  'nodejs',
  'yLT3a3DAedfKHZM7',
  {
    host: '139.9.60.254',
    dialect: 'mysql',
    define: {
      // 不自动在数据库名称后加's'
      freezeTableName: true,
      // // 自动导入时间戳
      // timestamps: true
    },
    dialectOptions: {
      dataStrings: true,
      typeCast: true,
      useUTC: false
    },
    // 设置时区为 "东八区"
  }
);

module.exports = sequelize;
