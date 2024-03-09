
const { CODE_ERROR, CODE_SUCCESS } = require("../../utils/constant");
const { getListPage, addOne, getByCondition, countAll, getAll, updateMulti, deleteMulti } = require('../../utils')
const {
  user: { Teacher, Student },
  course: { Course, CourseStudentRef },
  department: { Speciality, Department }
} = require('../../db/modules/index')
const { permissionQuery } = require('./util')

// 查询课程列表
async function courseList (req, res, next) {
  getListPage({
    sequelizeObj: Course,
    listPageParams: req.query,
    raw: true,
    // 连接查询课程的专业、学院以及类型信息
    include: [{
      model: Speciality,
      attributes: ['specialityId', 'specialityName'],
      include: {
        model: Department,
        attributes: ['departmentId', 'departmentName']
      }
    }],
    onSuccess: (data) => {
      res.json({
        code: CODE_SUCCESS,
        message: '查询成功',
        data
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

async function courseDetail (req, res, next) {
  const { courseId } = req.query
  getByCondition({
    sequelizeObj: Course,
    raw: true,
    reqParams: { courseId },
    onSuccess: ([ course ]) => {
      res.json({
        code: CODE_SUCCESS,
        message: '查询成功',
        data: course
      })
    }
  })
}

// 新增课程
function addCourse (req, res, next) {
  addOne({
    sequelizeObj: Course,
    reqParams: req.body,
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '新增成功',
        data: null
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

// 更新课程信息
function updateCourse (req, res, next) {
  if (!req.body.courseId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  const { courseName, courseDescription, courseCode, isPublish } = req.body
  updateMulti({
    sequelizeObj: Course,
    reqParams: { courseName, courseDescription, courseCode, isPublish },
    condition: { courseId: req.body.courseId },
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '更新成功',
        data: null
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

// 批量删除课程信息
function deleteCourse (req, res, next) {
  if (!Array.isArray(req.body?.courseIdList)) {
    res.json({
      code: CODE_ERROR,
      message: '数据格式错误',
      data: null
    })
    return
  }
  deleteMulti({
    sequelizeObj: Course,
    reqParams: { courseId: req.body.courseIdList },
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '删除成功',
        data: null
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

// 获取学生选该课程列表分页
function getChooseCourseList (req, res, next) {
  console.log(req.query.courseId, 666, 777, 888)
    getListPage({
      sequelizeObj: Student,
      listPageParams: req.query,
      raw: true,
      include: [{
        model: Course,
        where: { courseId: req.query.courseId }
      }],
      onSuccess: (list) => {
        res.json({
          code: CODE_SUCCESS,
          message: '查询成功',
          data: list
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

// 删除学生选课信息
function removeStudentFromCourse (req, res, next) {
  const { studentIdList } = req.body
  deleteMulti({
    sequelizeObj: CourseStudentRef,
    reqParams: { studentId: studentIdList },
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '删除成功',
        data: null
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
  courseList,
  courseDetail,
  addCourse,
  updateCourse,
  deleteCourse,
  getChooseCourseList,
  removeStudentFromCourse
}
