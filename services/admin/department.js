
const { CODE_ERROR, CODE_SUCCESS } = require("../../utils/constant");
const { department: { Department, Speciality } } = require('../../db/modules/index')
const { getListPage, getByCondition, updateMulti } = require('../../utils')

// 查询学院列表
async function departmentList (req, res, next) {
  getListPage({
    sequelizeObj: Department,
    listPageParams: req.query,
    raw: true,
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


// 查询学院详情
async function getDepartmentDetail (req, res, next) {
  if (!req.query.departmentId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  getByCondition({
    sequelizeObj: Department,
    raw: true,
    reqParams: {
      departmentId: req.query.departmentId
    },
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

// 更新学院信息
function updateDepartment (req, res, next) {
  if (!req.body.departmentId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  const reqParams = {
    departmentName: req.body.departmentName
  }
  updateMulti({
    sequelizeObj: Department,
    reqParams,
    condition: { departmentId: req.body.departmentId },
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

// 查询专业列表
async function specialityList (req, res, next) {
  getListPage({
    sequelizeObj: Speciality,
    listPageParams: req.query,
    raw: true,
    include: {
      model: Department,
      attributes: ['departmentId', 'departmentName']
    },
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

// 获取所有专业的列表
async function getAllSpeciality (req, res, next) {
  getByCondition({
    sequelizeObj: Department,
    needFields: ['departmentId', 'departmentName'],
    include: [{
      model: Speciality,
      attributes: ['specialityId', 'specialityName']
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

// 查询专业详情
async function getSpecialityDetail (req, res, next) {
  if (!req.query.specialityId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  getByCondition({
    sequelizeObj: Speciality,
    raw: true,
    reqParams: {
      specialityId: req.query.specialityId
    },
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

// 更新专业信息
function updateSpeciality (req, res, next) {
  if (!req.body.specialityId) {
    res.json({
      code: CODE_ERROR,
      message: '未知ID',
      data: null
    })
    return
  }
  const reqParams = {
    specialityName: req.body.specialityName
  }
  updateMulti({
    sequelizeObj: Speciality,
    reqParams,
    condition: { specialityId: req.body.specialityId },
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

module.exports = {
  // 学院
  departmentList,
  getDepartmentDetail,
  updateDepartment,
  // 专业
  specialityList,
  getAllSpeciality,
  getSpecialityDetail,
  updateSpeciality
}
