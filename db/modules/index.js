const { Speciality, Department } = require('./department')
const { Student, Teacher, Admin } = require('./user')
const { Course, CourseType, CourseStudentRef } = require('./course')
const { Post, Comment } = require('./post')
/**
 * 教师专业关系配置
 */
Teacher.belongsTo(Speciality, {
  foreignKey: 'specialityId'
})
Speciality.hasMany(Teacher, {
  foreignKey: 'specialityId'
})

/**
 * 学生专业关系配置
 */
Student.belongsTo(Speciality, {
  foreignKey: 'specialityId'
})
Speciality.hasMany(Student, {
  foreignKey: 'specialityId'
})

/**
 * 管理员学院关系配置
 */
Admin.belongsTo(Department, {
  foreignKey: 'departmentId'
})
Department.hasMany(Admin, {
  foreignKey: 'departmentId'
})

/**
 * 专业学院关系配置
 */
Speciality.belongsTo(Department, {
  foreignKey: 'departmentId'
})
Department.hasMany(Speciality, {
  foreignKey: 'departmentId'
})

/**
 * 课程与专业关系配置
 */
Course.belongsTo(Speciality, {
  foreignKey: 'specialityId'
})
Speciality.hasMany(Course, {
  foreignKey: 'specialityId'
})

/**
 * 课程教师关系配置
 */
Course.belongsTo(Teacher, {
  foreignKey: 'teacherId'
})
Teacher.hasMany(Course, {
  foreignKey: 'teacherId'
})

/**
 * 学生选课关系配置，多对多
 */
Student.belongsToMany(Course, {
  through: CourseStudentRef,
  foreignKey: 'studentId'
})
Course.belongsToMany(Student, {
  through: CourseStudentRef,
  foreignKey: 'courseId'
})

/**
 * 帖子课程关系配置
 */
Post.belongsTo(Course, {
  foreignKey: 'courseId'
})
Course.hasMany(Post, {
  foreignKey: 'courseId'
})

/**
 * 帖子评论关系配置
 */
Comment.belongsTo(Post, {
  foreignKey: 'postId'
})
Post.hasMany(Comment, {
  foreignKey: 'postId'
})

/**
 * 帖子师生关系配置
 */
Post.belongsTo(Teacher, {
  foreignKey: 'teacherId'
});
Post.belongsTo(Student, {
  foreignKey: 'studentId'
});

/**
 * 评论师生关系配置
 */
Comment.belongsTo(Teacher, {
  foreignKey: 'teacherId'
});
Comment.belongsTo(Student, {
  foreignKey: 'studentId'
});

/**
 * 评论与评论关系配置
 */
Comment.belongsTo(Comment, {
  foreignKey: 'parentId',
  as: 'parentComment'
})

module.exports = {
  user: {
    Teacher,
    Student,
    Admin,
  },
  department: {
    Department,
    Speciality
  },
  course: {
    Course,
    CourseType,
    CourseStudentRef
  },
  post: {
    Post,
    Comment
  }
}
