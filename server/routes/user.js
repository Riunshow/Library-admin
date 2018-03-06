const express = require('express')
const router = express.Router()
const UserDataModel = require('../mongo/model')

const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

// 用户登录
router.post('/login', (req, res) => {
    const { loginId, loginPsd } = req.body
    UserDataModel.findOne({ userid: loginId }, {
        username: 1,
        password: 1
    }, (err, userInfo) => {
        if (err) {
            console.log(err)
        }
        if (!userInfo) {
            res.send({
                status: 'false',
                msg: '用户不存在'
            })
            return console.log('用户不存在！')
        }
        userInfo.comparePassword(loginPsd, function(err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.isLogin = true
                req.session.userInfo = {
                    userId: userInfo.userid,
                    userName: userInfo.name,
                }
                res.send({
                    status: 'true',
                    userId: userInfo.userid,
                    userName: userInfo.name,
                })
            } else {
                res.send({
                    status: 'false',
                    msg: '密码错误'
                })
            }
        })
    })
});
// 用户登出
router.post('/signout', (req, res) => {
    req.session.isLogin = false
    res.send({
        status: 'true',
        msg: '登出成功！'
    })
});
// 获取用户信息
router.get('/userinfo', (req, res) => {
    if (req.session.isLogin) {
        res.send({
            status: 'true',
            info: {
                userId: req.session.userInfo.userId,
                userName: req.session.userInfo.userName,
                checkStatus: "True",
                userAttention: "1",
                userFans: "2",
                userIntegral: "300"
            }
        })
    } else {
        res.send({
            status: 'false',
            msg: '请登录！'
        })
    }
});