
const express = require("express");
const router = express.Router(); // 注册路由
const service = require('../../services/admin/post')

// 帖子查询路由
router.get('/postManage/postList', service.postList);

// 查询帖子详情路由
router.get('/postManage/getPostDetail', service.getPostDetail)

// 保存帖子详情路由
router.post('/postManage/savePostDetail', service.savePostDetail)

// 删除帖子路由
router.post('/postManage/deletePost', service.deletePost)

// 评论查询路由
router.get('/commentManage/commentList', service.commentList)

// 查询评论详情路由
router.get('/commentManage/getCommentDetail', service.getCommentDetail)

// 删除评论路由
router.post('/commentManage/deleteComment', service.deleteComment)

module.exports = router
