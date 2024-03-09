const { validationResult } = require('express-validator')
const {
  getByCondition,
  getListPage,
  updateMulti, deleteMulti, addOne, countAll
} = require('../../utils')
const { user: { Admin, Student, Teacher }, department: { Speciality, Department } } = require("../../db/modules/index");
const { CODE_ERROR, CODE_SUCCESS, JWT_EXPIRED, PRIVATE_KEY } = require("../../utils/constant");
const boom = require("boom");
const jwt = require("jsonwebtoken");
const md5 = require('../../utils/md5')
const { Op } = require('sequelize')
const { permissionQuery } = require('./util')
const { decode } = require('../../utils/user-jwt')

// 管理员登录
function loginAdmin (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    let { adminPhone, password } = req.body;
    getByCondition({
      sequelizeObj: Admin,
      raw: true,
      reqParams: { adminPhone, password },
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
        const admin = data[0]
        console.log(admin)
        const token = jwt.sign(
          // payload：签发的 token 里面要包含的一些数据。
          admin,
          // 私钥
          PRIVATE_KEY,
          // 设置过期时间
          { expiresIn: JWT_EXPIRED }
        )
        res.json({
          code: CODE_SUCCESS,
          message: '登录成功',
          data: {
            userInfo: admin,
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
}

// 查询管理员列表
async function adminManageList (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    getListPage({
      sequelizeObj: Admin,
      listPageParams: req.query,
      raw: true,
      include: {
        model: Department,
        attributes: ['departmentName', 'departmentId']
      },
      reqParams: {
        adminId: {
          [Op.ne]: decode(req).adminId
        }
      },
      excludeFields: ['password'],
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
}

// 查询管理员详情
async function getAdminDetail (req, res, next) {
  const err = validationResult(req)
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    if (!req.query.adminId) {
      res.json({
        code: CODE_ERROR,
        message: '未知ID',
        data: null
      })
      return
    }
    getByCondition({
      sequelizeObj: Admin,
      raw: true,
      reqParams: {
        adminId: req.query.adminId
      },
      excludeFields: ['password'],
      onSuccess: (data) => {
        res.json({
          code: CODE_SUCCESS,
          message: '查询成功',
          data: data[0]
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
}

// 新增管理员
async function addAdmin (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    addOne({
      sequelizeObj: Admin,
      reqParams: {
        ...req.body,
        // 默认密码
        password: md5('123456')
      },
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
}

// 更新管理员信息
function updateAdmin (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    if (!req.body.adminId) {
      res.json({
        code: CODE_ERROR,
        message: '未知ID',
        data: null
      })
      return
    }
    const reqParams = {
      adminName: req.body.adminName,
      adminPhone: req.body.adminPhone,
      adminEmail: req.body.adminEmail
    }
    updateMulti({
      sequelizeObj: Admin,
      reqParams,
      condition: { adminId: req.body.adminId },
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
}

// 删除管理员信息
function deleteAdmins (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    if (!Array.isArray(req.body?.adminIdList)) {
      res.json({
        code: CODE_ERROR,
        message: '数据格式错误',
        data: null
      })
      return
    }
    deleteMulti({
      sequelizeObj: Admin,
      reqParams: { adminId: req.body.adminIdList },
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
}


// 管理员查询教师列表
async function teacherManageList (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    getListPage({
      sequelizeObj: Teacher,
      listPageParams: req.query,
      raw: true,
      include: [{
        model: Speciality,
        required: true,
        where: await permissionQuery(req),
        include: {
          model: Department,
          required: true
        }
      }],
      excludeFields: ['password'],
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
}

async function getTeacherByNameOrNo (req, res, next) {
  getByCondition({
    sequelizeObj: Teacher,
    raw: true,
    include: [{
      model: Speciality,
      attributes: [],
      required: true,
      include: {
        model: Department,
        required: true,
      }
    }],
    reqParams: {
      [Op.or]: {
        teacherId: req.query.name,
        teacherNo: req.query.name
      }
    },
    onSuccess: (data) => {
      res.json({
        code: CODE_SUCCESS,
        message: '查询成功',
        data: data.map(v => {
          return {
            label: v.teacherName,
            value: v.teacherId,
            teacherNo: v.teacherNo
          }
        })
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

// 管理员查询教师详情
async function getTeacherDetail (req, res, next) {
  if (!req.query.teacherId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  getByCondition({
    sequelizeObj: Teacher,
    raw: true,
    reqParams: {
      teacherId: req.query.teacherId
    },
    excludeFields: ['password'],
    onSuccess: (data) => {
      res.json({
        code: CODE_SUCCESS,
        message: '查询成功',
        data: data[0]
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

// 新增教师
async function addTeacher (req, res, next) {
  addOne({
    sequelizeObj: Teacher,
    reqParams: {
      ...req.body,
      // 默认密码
      password: md5('123456')
    },
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

// 更新教师信息
async function updateTeacher (req, res, next) {
  if (!req.body.teacherId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  const reqParams = {
    teacherName: req.body.teacherName,
    teacherPhone: req.body.teacherPhone,
    teacherEmail: req.body.teacherEmail
  }
  updateMulti({
    sequelizeObj: Teacher,
    reqParams,
    condition: { teacherId: req.body.teacherId },
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

// 删除教师信息
function deleteTeachers (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    if (!Array.isArray(req.body?.teacherIdList)) {
      res.json({
        code: CODE_ERROR,
        message: '数据格式错误',
        data: null
      })
      return
    }
    deleteMulti({
      sequelizeObj: Teacher,
      reqParams: { teacherId: req.body.teacherIdList },
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
}

// 管理员查询学生列表
async function studentManageList (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    getListPage({
      sequelizeObj: Student,
      listPageParams: req.query,
      reqParams: req.query,
      raw: true,
      include: [{
        model: Speciality,
        required: true,
        where: await permissionQuery(req),
        include: {
          model: Department,
          required: true
        }
      }],
      excludeFields: ['password'],
      onSuccess: async (data) => {
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
}

// 管理员查询学生详情
async function getStudentDetail (req, res, next) {
  const err = validationResult(req)
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    if (!req.query.studentId) {
      res.json({
        code: CODE_ERROR,
        message: '未知ID',
        data: null
      })
      return
    }
    getByCondition({
      sequelizeObj: Student,
      raw: true,
      reqParams: {
        studentId: req.query.studentId
      },
      excludeFields: ['password'],
      onSuccess: (data) => {
        res.json({
          code: CODE_SUCCESS,
          message: '查询成功',
          data: data[0]
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
}

// 新增学生
function addStudent (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    addOne({
      sequelizeObj: Student,
      reqParams: {
        ...req.body,
        // 默认密码
        password: md5('123456')
      },
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
}

// 更新学生信息
async function updateStudent (req, res, next) {
  if (!req.body.studentId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  const reqParams = {
    studentName: req.body.studentName,
    studentPhone: req.body.studentPhone,
    studentEmail: req.body.studentEmail
  }
  updateMulti({
    sequelizeObj: Student,
    reqParams,
    condition: { studentId: req.body.studentId },
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

// 删除学生信息
function deleteStudents (req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回
    next(boom.badRequest(msg));
  } else {
    if (!Array.isArray(req.body?.studentIdList)) {
      res.json({
        code: CODE_ERROR,
        message: '数据格式错误',
        data: null
      })
      return
    }
    deleteMulti({
      sequelizeObj: Student,
      reqParams: { studentId: req.body.studentIdList },
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
}

module.exports = {
  // 登录
  loginAdmin,
  // 管理员管理
  adminManageList,
  getAdminDetail,
  addAdmin,
  updateAdmin,
  deleteAdmins,
  // 教师管理
  teacherManageList,
  getTeacherDetail,
  addTeacher,
  updateTeacher,
  deleteTeachers,
  getTeacherByNameOrNo,
  // 学生管理
  studentManageList,
  getStudentDetail,
  addStudent,
  updateStudent,
  deleteStudents,
}
