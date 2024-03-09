
const { decode } = require('../../utils/user-jwt')

/**
 * 根据header的token获取对应用户信息
 * @param req 对应请求，用来筛取管理员所属学院
 * @returns {Promise<unknown>} { departmentId: xxx }（S管理员）<br/>{ } （SA管理员）<br/>(注意是Promise)
 */
function permissionQuery (req) {
  return new Promise((resolve, reject) => {
    const { departmentId, role } = decode(req)
    console.log('Decode request\'s header info:')
    console.log(decode(req))
    if (role === 'SA') {
      resolve({})
    } else {
      resolve({ departmentId })
    }
  })
}

module.exports = { permissionQuery }
