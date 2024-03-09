const express = require("express");
const adminUserRouter = require("./user")
const adminDepartmentRouter = require("./department")
const adminCourseRouter = require("./course")
const adminPostRouter = require('./post')
const router = express.Router()

router.use(adminUserRouter)
router.use(adminDepartmentRouter)
router.use(adminCourseRouter)
router.use(adminPostRouter)

module.exports = router;
