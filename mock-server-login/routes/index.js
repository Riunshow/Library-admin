var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', (req, res, next) => {
    const { user_name } = req.body
    if (user_name == 'sysadmin') {
        res.send({
            username: 'sysadmin',
            role: 20
        })
    } else if (user_name == 'bookadmin') {
        res.send({
            username: 'bookadmin',
            role: 10
        })
    }
});

module.exports = router;