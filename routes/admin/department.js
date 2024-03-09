
const express = require("express");
const router = express.Router(); // 注册路由
const service = require('../../services/admin/department')

// 学院查询路由
router.get('/departmentManage/departmentList', service.departmentList);

// 查询学院详情路由
router.get('/departmentManage/departmentDetail', service.getDepartmentDetail);

// 学院信息更新路由
router.post('/departmentManage/updateDepartment', service.updateDepartment);

// 专业查询路由
router.get('/specialityManage/specialityList', service.specialityList);

// 所有专业查询路由
router.get('/specialityManage/getAllSpeciality', service.getAllSpeciality);

// 查询专业详情路由
router.get('/specialityManage/specialityDetail', service.getSpecialityDetail);

// 专业信息更新路由
router.post('/specialityManage/updateSpeciality', service.updateSpeciality);

module.exports = router
