/**
 * router.js 路由模块
 * 职责：
 *   处理路由
 *   根据不同的请求方法+请求路径设置具体的请求处理函数
 * 模块职责要单一，不要乱写
 * 我们划分模块的目的就是为了增强项目代码的可维护性
 * 提升开发效率
 */

var fs = require('fs')
var Student = require('./student')
// Express 提供了一种更好的方式
// 专门用来包装路由的
var express = require('express')

// 1. 创建一个路由容器
var router = express.Router()
// 2. 把路由都挂载到 router 路由容器中
/*
 * 渲染学生列表页面
 */
router.get('/students', function (req, res) {
  Student.find(function (err, students) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('index.html', {
      fruits: [
        '苹果',
        '香蕉',
        '橘子'
      ],
      students: students
    })
  })
})

/*
 * 打开学生添加学生页面
 */
router.get('/students/new', function (req, res) {
  res.render('new.html')
})

/*
 * 处理添加学生
 */
router.post('/students/add', function (req, res) {
  // 1. 获取表单数据
  // 2. 处理
  //    将数据保存到 db.json 文件中用以持久化
  // 3. 发送响应
  new Student(req.body).save( function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

/*
 * 点击编辑，根据ID显示相关数据
 */
router.get('/students/edit', function (req, res) {
  Student.findById(req.query.id.replace(/"/g,''), function (err, student) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.render('edit.html', {
      student: student
    })
  })
})

/*
 * 处理编辑学生
 */
router.post('/students/edit', function (req, res) {
  console.log(req.body)
  Student.findByIdAndUpdate(req.body.id.replace(/"/g,''),req.body, function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

/*
 * 处理删除学生
 */
router.get('/students/delete', function (req, res) {
  Student.findByIdAndRemove(req.query.id.replace(/"/g,''), function (err) {
    if (err) {
      return res.status(500).send('Server error.')
    }
    res.redirect('/students')
  })
})

// 3. 把 router 导出
module.exports = router
