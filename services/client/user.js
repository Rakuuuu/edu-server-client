const { validationResult } = require("express-validator");
const boom = require("boom");
const { addOne, getByCondition } = require("../../utils");
const { user: { Teacher, Student } } = require("../../db/modules/index");
const { CODE_SUCCESS, CODE_ERROR, PRIVATE_KEY, JWT_EXPIRED } = require("../../utils/constant");
const jwt = require('jsonwebtoken')

// 注册教师信息
function registerTeacher (req, res, next) {
  const { teacherPhone, teacherName, teacherNo, password } = req.body
  addOne({
    sequelizeObj: Teacher,
    params: {
      teacherPhone,
      teacherName,
      teacherNo,
      password
    },
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '注册成功',
        data: null
      })
    },
    onFail: (err) => {
      console.log(err)
      res.json({
        code: CODE_ERROR,
        message: err,
        data: null
      })
    }
  })
}

//学生注册
function registerStudent (req, res, next) {
  const { studentPhone, studentName, studentNo, password } = req.body
  console.log({ studentPhone, studentName, studentNo, password })
  addOne({
    sequelizeObj: Student,
    reqParams: {
      studentPhone,
      studentName,
      studentNo,
      password
    },
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '注册成功',
        data: null
      })
    },
    onFail: (err) => {
      console.log(err)
      res.json({
        code: CODE_ERROR,
        message: err.message,
        data: null
      })
    }
  })
}

// 学生账号密码登录
async function loginStudent (req, res, next) {
  const { studentPhone, password } = req.body
  getByCondition({
    sequelizeObj: Student,
    raw: true,
    reqParams: { studentPhone, password },
    excludeFields: ['password'],
    onSuccess: (data) => {
      if (!data.length) {
        res.json({
          code: CODE_ERROR,
          message: '手机号或密码错误',
          data: null
        })
        return
      }
      console.log('校验成功')
      console.log(data)
      const student = { ...data[0], role: 'STUDENT' }
      const token = jwt.sign(
        // payload：签发的 token 里面要包含的一些数据。
        student,
        // 私钥
        PRIVATE_KEY,
        // 设置过期时间
        { expiresIn: JWT_EXPIRED }
      )
      res.json({
        code: CODE_SUCCESS,
        message: '登录成功',
        data: {
          userInfo: student,
          token
        }
      })
    },
    onFail: (err) => {
      console.log(err)
      res.json({
        code: CODE_ERROR,
        message: '未知错误',
        data: null
      })
    }
  })
}

module.exports = {
  registerStudent,
  registerTeacher,
  loginStudent
}
