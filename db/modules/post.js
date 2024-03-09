const sequelize = require('../dbConfig')
const { DataTypes } = require("sequelize")

const Post = sequelize.define('edu_post', {
  // 帖子ID
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 帖子标题
  postTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 帖子主题内容
  postContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // 帖子访问数量
  postVisitCounts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // 发送人（教师）
  teacherId: {
    type: DataTypes.INTEGER
  },
  // 发送人（学生）
  studentId: {
    type: DataTypes.INTEGER
  }
}, {
  underscored: true
})

const Comment = sequelize.define('edu_comment', {
  // 评论ID
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 评论内容
  commentContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // 关联帖子ID
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // 发送人（学生）
  studentId: {
    type: DataTypes.INTEGER
  },
  // 对应父评论ID
  parentId: {
    type: DataTypes.INTEGER
  },
  // 发送人（教师）
  teacherId: {
    type: DataTypes.INTEGER
  }
}, {
  underscored: true
})

module.exports = { Post, Comment }
