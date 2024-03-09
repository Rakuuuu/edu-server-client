const { body } = require("express-validator");
const service = require("../../services/admin/user")
const express = require("express");
const router = express.Router(); // 注册路由

// 管理员登录校验
const adminValidator = [
  body('adminPhone').isMobilePhone('zh-CN').withMessage('手机号类型错误'),
  body('password').isString().withMessage('密码类型错误')
]

// 管理员登录路由
router.post('/login', adminValidator, service.loginAdmin);

// 管理员查询路由
router.get('/adminManage/adminList', service.adminManageList);

// 教师详情查询路由
router.get('/adminManage/getAdminDetail', service.getAdminDetail);

// 新增管理员信息路由
router.post('/adminManage/addAdmin', service.addAdmin);

// 管理员信息更新路由
router.post('/adminManage/updateAdmin', service.updateAdmin);

// 管理员批量删除路由
router.post('/adminManage/deleteAdmins', service.deleteAdmins);


// 教师管理查询路由
router.get('/teacherManage/teacherList', service.teacherManageList);

// 教师详情查询路由
router.get('/teacherManage/getTeacherDetail', service.getTeacherDetail);

// 新增教师信息路由
router.post('/teacherManage/addTeacher', service.addTeacher);

// 教师信息更新路由
router.post('/teacherManage/updateTeacher', service.updateTeacher);

// 教师批量删除路由
router.post('/teacherManage/deleteTeachers', service.deleteTeachers);

// 根据教师名或教师号查询教师
router.get('/teacherManage/getTeacherByNameOrNo', service.getTeacherByNameOrNo)

// 学生管理查询路由
router.get('/studentManage/studentList', service.studentManageList);

// 学生详情查询路由
router.get('/studentManage/getStudentDetail', service.getStudentDetail);

// 新增学生信息路由
router.post('/studentManage/addStudent', service.addStudent);

// 学生信息更新路由
router.post('/studentManage/updateStudent', service.updateStudent);

// 学生批量删除路由
router.post('/studentManage/deleteStudents', service.deleteStudents);

module.exports = router;
