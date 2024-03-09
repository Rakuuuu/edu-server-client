const sequelize = require('../dbConfig')
const { DataTypes, Op } = require("sequelize");

const Teacher = sequelize.define('edu_teacher', {
  // 教师id
  teacherId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  // 教师号
  teacherNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // 教师手机号
  teacherPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // 教师邮箱
  teacherEmail: {
    type: DataTypes.STRING,
  },
  // 教师所属专业
  specialityId: {
    type: DataTypes.INTEGER,
  },
  //教师名称
  teacherName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 密码（MD5）
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  underscored: true
})

const Student = sequelize.define('edu_student', {
  // 学生id
  studentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 学号
  studentNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // 学生性别
  studentSex: {
    type: DataTypes.STRING,
  },
  // 学生年龄
  studentAge: {
    type: DataTypes.INTEGER,
  },
  // 学生年级
  studentGrade: {
    type: DataTypes.STRING,
  },
  // 学生手机号
  studentPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // 学生邮箱
  studentEmail: {
    type: DataTypes.STRING,
  },
  // 学生所属专业
  specialityId: {
    type: DataTypes.INTEGER,
  },
  // 学生介绍
  studentIntroduction: {
    type: DataTypes.STRING,
  },
  // 学生名称
  studentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 密码（MD5）
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  underscored: true
})

const Admin = sequelize.define('edu_admin', {
  // 管理员id
  adminId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // 学院id
  departmentId: {
    type: DataTypes.INTEGER
  },
  adminName: {
    type: DataTypes.STRING
  },
  adminPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 密码（MD5）
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 角色权限控制
  role: {
    type: DataTypes.STRING
  }
}, {
  underscored: true
})

// HOOK钩子，在插入数据前校验教师号/学号和电话号码字段是否存在
Student.beforeCreate(async (student, options) => {
  const { studentPhone, studentNo } = student
  const existingStudent = await Student.findOne({
    where: {
      [Op.or]: [
        { studentPhone },
        { studentNo }
      ]
    }
  });
  if (existingStudent) {
    throw new Error('学号或电话已存在');
  }
});

Teacher.beforeCreate(async (teacher, options) => {
  const { teacherPhone, teacherNo } = teacher
  const existingStudent = await Student.findOne({
    where: {
      [Op.or]: [
        { teacherPhone },
        { teacherNo }
      ]
    }
  });
  if (existingStudent) {
    throw new Error('教师号或电话已存在');
  }
});

module.exports = { Teacher, Student, Admin }
