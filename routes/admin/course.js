
const express = require("express");
const router = express.Router(); // 注册路由
const service = require('../../services/admin/course')

// 课程查询路由
router.get('/courseManage/courseList', service.courseList);

// 课程类型查询路由
router.get('/courseManage/courseDetail', service.courseDetail)

// 新建课程
router.post('/courseManage/addCourse', service.addCourse)

// 修改课程
router.post('/courseManage/updateCourse', service.updateCourse)

//删除课程（批量）
router.post('/courseManage/deleteCourse', service.deleteCourse)

// 课程类型查询路由
router.get('/courseManage/getChooseCourseList', service.getChooseCourseList)

//删除学生选课信息（批量）
router.post('/courseManage/removeStudentFromCourse', service.removeStudentFromCourse)

module.exports = router
