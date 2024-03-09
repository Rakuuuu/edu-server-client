
const { CODE_ERROR, CODE_SUCCESS } = require("../../utils/constant");
const { getListPage, getByCondition, updateMulti, deleteMulti } = require('../../utils')
const { user: { Teacher, Student }, post: { Post, Comment }, course: { Course } } = require('../../db/modules/index')

// 获取帖子列表分页
async function postList (req, res, next) {
  getListPage({
    sequelizeObj: Post,
    raw: true,
    listPageParams: req.query,
    needFields: ['postId', 'postTitle', 'postVisitCounts'],
    include: [{
      model: Student,
      attributes: ['studentName', 'specialityId']
    },{
      model: Teacher,
      attributes: ['teacherName', 'specialityId']
    }, {
      model: Course,
      attributes: ['courseName', 'courseId']
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

// 获取帖子详情
async function getPostDetail (req, res, next) {
  getByCondition({
    sequelizeObj: Post,
    reqParams: { postId: req.query.postId },
    raw: true,
    include: [{
      model: Student,
      attributes: ['studentName', 'specialityId']
    },{
      model: Teacher,
      attributes: ['teacherName', 'specialityId']
    }, {
      model: Course,
      attributes: ['courseName', 'courseId']
    }],
    onSuccess: ([data]) => {
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

// 保存帖子主题
async function savePostDetail (req, res, next) {
  updateMulti({
    sequelizeObj: Post,
    condition: { postId: req.body.postId },
    reqParams: { postContent: req.body.postContent },
    onSuccess: () => {
      res.json({
        code: CODE_SUCCESS,
        message: '保存成功',
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

// 批量删除帖子
async function deletePost (req, res, next) {
  deleteMulti({
    sequelizeObj: Post,
    reqParams: {
      postId: req.body.postIdList
    },
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

// 评论列表
async function commentList (req, res, next) {
  getListPage({
    sequelizeObj: Comment,
    listPageParams: req.query,
    needFields: ['commentContent', 'commentId'],
    raw: true,
    include: [{
      model: Post,
      attributes: ['postId', 'postTitle'],
      include: [{
        model: Course,
        attributes: ['courseId', 'courseName']
      }]
    }, {
      model: Student,
      attributes: ['studentId', 'studentName']
    }, {
      model: Teacher,
      attributes: ['teacherId', 'teacherName']
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

// 获取评论详情
async function getCommentDetail (req, res, next) {
  console.log(req.query.commentId, 666, 777, 888)
  getByCondition({
    sequelizeObj: Comment,
    reqParams: {
      commentId: req.query.commentId
    },
    include: [{
      model: Student,
      attributes: ['studentId', 'studentName']
    }, {
      model: Teacher,
      attributes: ['teacherId', 'teacherName']
    }, {
      model: Post,
      attributes: ['postId', 'postContent', 'postTitle'],
      include: [{
        model: Course,
        attribute: ['courseId', 'courseName']
      }]
    }, {
      model: Comment,
      as: 'parentComment',
      // attributes: [
      //   ['commentId', 'pCommentId'],
      //   ['commentContent', 'pCommentContent'],
      // ],
      include: [{
        model: Student,
        attributes: ['studentId', 'studentName']
      }, {
        model: Teacher,
        attributes: ['teacherId', 'teacherName']
      }]
    }],
    onSuccess: ([data]) => {
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

// 批量删除评论
async function deleteComment (req, res, next) {
  deleteMulti({
    sequelizeObj: Comment,
    reqParams: {
      commentId: req.body.commentIdList
    },
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
  postList,
  getPostDetail,
  savePostDetail,
  deletePost,
  commentList,
  getCommentDetail,
  deleteComment
}
