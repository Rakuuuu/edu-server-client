/**
 * 描述: 业务逻辑处理 - 用户相关接口
 * 作者: Jack Chen
 * 日期: 2020-06-20
 */


const { querySql, queryOne } = require('../utils/index');
const md5 = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');
const sequelize = require('../db/dbConfig')
const { Teacher, Student, Admin } = require('../db/modules/user')
const {
  getListPage,
  getByCondition,
  addOne,
  countAll,
  updateMulti,
  deleteMulti
} = require("../utils");


// 登录
function login (req, res, next) {
}

// 重置密码
function resetPwd (req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, oldPassword, newPassword } = req.body;
    oldPassword = md5(oldPassword);
    validateUser(username, oldPassword)
      .then(data => {
        console.log('校验用户名和密码===', data);
        if (data) {
          if (newPassword) {
            newPassword = md5(newPassword);
            const query = `update sys_user set password='${ newPassword }' where username='${ username }'`;
            querySql(query)
              .then(user => {
                // console.log('密码重置===', user);
                if (!user || user.length === 0) {
                  res.json({
                    code: CODE_ERROR,
                    msg: '重置密码失败',
                    data: null
                  })
                } else {
                  res.json({
                    code: CODE_SUCCESS,
                    msg: '重置密码成功',
                    data: null
                  })
                }
              })
          } else {
            res.json({
              code: CODE_ERROR,
              msg: '新密码不能为空',
              data: null
            })
          }
        } else {
          res.json({
            code: CODE_ERROR,
            msg: '用户名或旧密码错误',
            data: null
          })
        }
      })

  }
}

// 校验用户名和密码
function validateUser (username, oldPassword) {
  const query = `select id, username from sys_user where username='${ username }' and password='${ oldPassword }'`;
  return queryOne(query);
}

// 通过用户名查询用户信息
function findUser (username) {
  const query = `select id, username from sys_user where username='${ username }'`;
  return queryOne(query);
}

// 获取条件查询参数


module.exports = {
  login,
  loginAdmin,
  registerTeacher,
  registerStudent,
  teacherManageList,
  getTeacherDetail,
  updateTeacher,
  studentManageList,
  resetPwd
}
