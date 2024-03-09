/**
 * 描述: 自定义常量
 * 作者: Liu Jianle
 * 日期: 2024-01-28
 */

module.exports = {
  CODE_ERROR: -1, // 请求响应失败code码
  CODE_SUCCESS: 0, // 请求响应成功code码
  CODE_TOKEN_EXPIRED: 401, // 授权失败
  PRIVATE_KEY: 'liujianle', // 自定义jwt加密的私钥
  JWT_EXPIRED: 60 * 60 * 24, // 过期时间24小时
}
