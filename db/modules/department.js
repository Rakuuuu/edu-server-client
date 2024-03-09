const sequelize = require('../dbConfig')
const { DataTypes } = require("sequelize")
const { Student, Teacher, Admin } = require('./user')

const Department = sequelize.define('edu_department', {
  // 学院ID
  departmentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 学院名称
  departmentName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  underscored: true
})

const Speciality = sequelize.define('edu_speciality', {
  // 专业ID
  specialityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 专业名称
  specialityName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  underscored: true
})

module.exports = { Department, Speciality }
