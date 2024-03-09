/**
 * 描述: sequelize，连接mysql模块
 * 作者: 2000300322 刘健乐
 * 日期: 2024-02-01
 */


const mysql = require('mysql');
const config = require('../db/dbConfig');
const { CODE_ERROR, CODE_SUCCESS } = require("./constant");
const sequelize = require("../db/dbConfig");
const { where } = require("sequelize");
const { Teacher } = require("../db/modules/user");

// 连接mysql
function connect () {
  const { host, user, password, database } = config;
  return mysql.createConnection({
    host,
    user,
    password,
    database
  })
}

// 新建查询连接
function querySql (sql) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    } catch (e) {
      reject(e);
    } finally {
      // 释放连接
      conn.end();
    }
  })
}

// 查询一条语句
function queryOne (sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(res => {
      console.log('res===', res)
      if (res && res.length > 0) {
        resolve(res[0]);
      } else {
        resolve(null);
      }
    }).catch(err => {
      reject(err);
    })
  })
}

/**
 * Sequelize 分页查询列表
 * @param sequelizeObj 对应的sequelize对象
 * @param listPageParams 分页参数
 * @param reqParams 请求筛选的参数，从body或query中获取，并传入对应权限的字段。
 *                  </br>若使用范围筛选，例如选择age<18的数据
 *                  </br>age: {[Sequelize.Op.lt]: 18}
 * @param include 遵循sequelize规则的连接查询配置
 * @param raw 连接表的字段是否展开
 * @param needFields 需要返回的字段名称数组
 * @param excludeFields 需要排除的字段名称数组遵循sequelize attribute.exclude的规则，不可与needFields混用
 * @param onSuccess 查询成功的回调，参数res
 * @param onFail 查询失败的回调，参数err
 */
function getListPage ({
    sequelizeObj,
    listPageParams,
    reqParams,
    include,
    raw,
    needFields,
    excludeFields,
    onSuccess,
    onFail
}) {
  const { currentPage, pageSize } = listPageParams
  const optionsObj = {
    offset: (currentPage - 1) * pageSize,
    limit: Number(pageSize),
    include,
    raw,
    order: [['createdAt', 'DESC']], // 按 createdAt 字段倒序排序
    where: getSearchParams(reqParams)
  }
  Array.isArray(needFields) && needFields.length && (optionsObj.attributes = [...needFields, 'createdAt', 'updatedAt'])
  Array.isArray(excludeFields) && excludeFields.length && (optionsObj.exclude  = excludeFields)

  sequelize.sync().then(() => {
    sequelizeObj.findAndCountAll({ ...optionsObj }).then(({ rows: list, count }) => {
      onSuccess({
        list: !raw ? list : list.map(item => {
                const obj = {}
                Object.keys(item).forEach(key => {
                  const keyArr = key.split('.')
                  obj[keyArr[keyArr.length - 1]] = item[key]
                })
                return obj
              }),
        total: count,
        currentPage: Number(currentPage),
        pageSize: list.length
      })
    }).catch(err => {
      onFail(err)
    })
  //   sequelizeObj.findAll({ ...optionsObj }).then(list => {
  //     return !raw ? list : list.map(item => {
  //       const obj = {}
  //       Object.keys(item).forEach(key => {
  //         const keyArr = key.split('.')
  //         obj[keyArr[keyArr.length - 1]] = item[key]
  //       })
  //       return obj
  //     })
  //   }).then(async (list) => {
  //     try {
  //       const count = await countAll({
  //         sequelizeObj: sequelizeObj,
  //         include,
  //         reqParams
  //       })
  //       onSuccess({
  //         list,
  //         total: count,
  //         currentPage: Number(currentPage),
  //         pageSize: list.length
  //       })
  //     } catch (err) {
  //       onFail(err)
  //     }
  //   }).catch(onFail)
  }).catch(onFail)
}

// 获取条件查询参数（清除空数据）
function getSearchParams (reqParams = {}) {
  const params = {}
  Object.keys(reqParams).forEach(key => {
    // 过滤空字段和分页参数
    if (reqParams[key] && !['currentPage', 'pageSize'].includes(key)) {
      params[key] = reqParams[key]
    }
  })
  return params
}

/**
 * Sequelize 条件查询
 * @param sequelizeObj 对应的sequelize对象
 * @param raw 连接表的字段是否展开
 * @param reqParams 请求筛选的参数，从body或query中获取，并传入对应权限的字段，遵循sequelize的where规则。
 *                  </br>若使用范围筛选，例如选择age<18的数据
 *                  </br>age: {[Sequelize.Op.lt]: 18}
 * @param include 遵循sequelize规则的连接查询配置
 * @param needFields 需要返回的字段名称数组
 * @param excludeFields 需要排除的字段名称数组遵循sequelize attribute.exclude的规则，不可与needFields混用
 * @param onSuccess 查询成功的回调，参数res
 * @param onFail 查询失败的回调，参数err
 */
function getByCondition ({
   sequelizeObj,
   include,
   raw,
   reqParams,
   needFields,
   excludeFields,
   onSuccess,
   onFail
}) {
  sequelize.sync().then(() => {
    const optionsObj = {
      where: getSearchParams(reqParams),
      include,
      order: [['createdAt', 'DESC']], // 按 createdAt 字段倒序排序
      raw
    }
    Array.isArray(needFields) && needFields.length && (optionsObj.attributes = [...needFields, 'createdAt', 'updatedAt'])
    Array.isArray(excludeFields) && excludeFields.length && (optionsObj.exclude  = excludeFields)
    sequelizeObj.findAll({ ...optionsObj }).then(list => {
      return !raw ? list : list.map(item => {
        const obj = {}
        Object.keys(item).forEach(key => {
          const keyArr = key.split('.')
          obj[keyArr[keyArr.length - 1]] = item[key]
        })
        return obj
      })
    }).then(onSuccess).catch(onFail)
  }).catch(onFail)
}

/**
 * Sequelize 全量查询，适用于枚举
 * @param sequelizeObj 对应的sequelize对象
 * @param include 遵循sequelize规则的连接查询配置
 * @param needFields 需要返回的字段名称数组，遵循sequelize includes规则，不可与excludeFields混用
 * @param excludeFields 需要排除的字段名称数组遵循sequelize attribute.exclude的规则，不可与needFields混用
 * @param onSuccess 查询成功的回调，参数res
 * @param onFail 查询失败的回调，参数err
 */
async function getAll ({ sequelizeObj, include, needFields, excludeFields, onSuccess, onFail }) {
  try {
    await sequelize.sync()
    const optionsObj = {
      include,
      raw: true,
    }
    Array.isArray(needFields) && needFields.length && (optionsObj.attributes = [...needFields, 'createdAt', 'updatedAt'])
    Array.isArray(excludeFields) && excludeFields.length && (optionsObj.exclude  = excludeFields)
    const res = await sequelizeObj.findAll({ ...optionsObj }).then(list => {
      return list.map(item => {
        const obj = {}
        Object.keys(item).forEach(key => {
          const keyArr = key.split('.')
          obj[keyArr[keyArr.length - 1]] = item[key]
        })
        return obj
      })
    })
    onSuccess(res)
  } catch (e) {
    onFail(e)
  }
}

/**
 * Sequelize 添加一条数据
 * @param sequelizeObj 对应的sequelize对象
 * @param reqParams 添加记录的参数
 * @param onSuccess 添加成功的回调，参数res
 * @param onFail 添加失败的回调，参数err
 */
function addOne ({ sequelizeObj, reqParams, onSuccess, onFail }) {
  sequelize.sync().then(() => {
    sequelizeObj.create(reqParams).then(onSuccess).catch(onFail)
  }).catch(onFail)
}

/**
 * Sequelize 添加多条数据
 * @param sequelizeObj 对应的sequelize对象
 * @param reqParams 添加记录的参数，对象数组
 * @param onSuccess 添加成功的回调，参数res
 * @param onFail 添加失败的回调，参数err
 */
function addMulti ({ sequelizeObj, reqParams, onSuccess, onFail }) {
  sequelize.sync().then(() => {
    return sequelizeObj.bulkCreate(reqParams);
  }).then(onSuccess).catch(onFail)
}

/**
 * Sequelize 删除数据
 * @param sequelizeObj 对应的sequelize对象
 * @param reqParams 删除记录的参数
 * @param onSuccess 删除成功的回调，参数res
 * @param onFail 删除失败的回调，参数err
 */
function deleteMulti ({ sequelizeObj, reqParams, onSuccess, onFail }) {
  sequelize.sync().then(() => {
    sequelizeObj.destroy({ where: reqParams }).then(onSuccess).catch(onFail)
  }).catch(onFail)
}

/**
 * Sequelize 修改数据
 * @param sequelizeObj 对应的sequelize对象
 * @param reqParams 修改记录的参数
 * @param condition 要修改的记录的筛选条件
 * @param onSuccess 修改成功的回调，参数res
 * @param onFail 修改失败的回调，参数err
 */
function updateMulti ({ sequelizeObj, reqParams, condition, onSuccess, onFail }) {
  sequelize.sync().then(() => {
    sequelizeObj.update(reqParams, { where: condition }).then(onSuccess).catch(onFail)
  }).catch(onFail)
}

/**
 * Sequelize 统计数据总量
 * @param sequelizeObj 对应的sequelize对象
 * @param reqParams 修改记录的参数
 * @param include 遵循sequelize的规则
 */
async function countAll ({ include, sequelizeObj, reqParams }) {
  try {
    await sequelize.sync()
    return await sequelizeObj.count({
      where: getSearchParams(reqParams),
      include
    })
  } catch (err) {
    console.log(err)
    return 0
  }
}

module.exports = {
  querySql,
  queryOne,
  addOne,
  addMulti,
  deleteMulti,
  updateMulti,
  countAll,
  getAll,
  getListPage,
  getByCondition,
}
