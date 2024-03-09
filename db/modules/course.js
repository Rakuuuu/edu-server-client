const sequelize = require('../dbConfig')
const { DataTypes } = require("sequelize")

const Course = sequelize.define('edu_course', {
  // 课程ID
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 课程名称
  courseName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 课程描述
  courseDescription: {
    type: DataTypes.STRING
  },
  // 课程类型枚举
  courseType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 加入课程代号
  courseCode: {
    type: DataTypes.STRING,
    unique: true
  },
  isPublish: {
    type: DataTypes.STRING,
    unique: true
  },
  // 课程教师ID
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  underscored: true
})


// 多对多选课关系表
const CourseStudentRef = sequelize.define('edu_course_student_ref', {
  // 课程id
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  // 学生id
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  underscored: true
})

module.exports = { Course, CourseStudentRef }
