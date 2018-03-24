var express = require('express');
var router = express.Router();

/**
 * 登录
 */
router.post('/login', (req, res, next) => {
    const { user_num } = req.body
    if (user_num == 'sysadmin') {
        res.send({
            username: 'sysadmin',
            role: 20,
            code: 0
        })
    } else if (user_num == 'bookadmin') {
        res.send({
            username: 'bookadmin',
            role: 10,
            code: 0
        })
    } else {
        res.send({
            code: -1
        })
    }
});

/**
 * 退出
 */
router.post('/logout', (req, res, next) => {
    res.send({
        code: 0
    })
});

module.exports = router;