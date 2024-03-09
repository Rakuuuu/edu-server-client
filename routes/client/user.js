// 教师注册校验
const { body } = require("express-validator")
const service = require("../../services/client/user");
const express = require("express");
const router = express.Router();

const validateRegisterStudent = [
  body('studentPhone').isMobilePhone('zh-CN').withMessage('请输入正确的手机号码'),
  body('studentName').isEmpty().withMessage('请输入学生姓名'),
  body('studentEmail').isEmail().withMessage('请输入正确的邮箱'),
  body('studentNo').isEmail().withMessage('请输入学号'),
  body('password').isEmpty().withMessage('请输入密码'),
]
const validateRegisterTeacher = [
  body('teacherPhone').isMobilePhone('zh-CN').withMessage('请输入正确的手机号码'),
  body('teacherName').isEmpty().withMessage('请输入教师姓名'),
  body('teacherEmail').isEmail().withMessage('请输入正确的邮箱'),
  body('teacherNo').isEmail().withMessage('请输入教师号'),
  body('password').isEmpty().withMessage('请输入密码'),
]
const validateLoginStudent = [
  body('studentPhone').isMobilePhone('zh-CN').withMessage('请输入正确的手机号码'),
  body('password').isEmpty().withMessage('请输入密码'),
]

// 用户注册路由
router.post('/user/registerStudent', ...validateRegisterStudent, service.registerStudent)
router.post('/user/registerTeacher', ...validateRegisterTeacher, service.registerTeacher)

// 用户登录路由
router.post('/user/loginStudent', ...validateLoginStudent, service.loginStudent)

module.exports = router
