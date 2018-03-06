var express = require('express');
var router = express.Router();

var http = require('http');
var qs = require('querystring');

var book_url = require('./../data/book1.json').url
var book_path = require('./../data/book1.json').path

var options = {
    host: book_url,
    port: 80,
    path: book_path,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};



/* GET home page. */
router.get('/', function(req, res, next) {

    var resData = "";

    var data = http.get(options, response => {
        response.on('data', chunk => {
            resData += chunk;
        })
        response.on("end", () => {
            console.log(resData);
            var result = resData.match(/\(([^)]*)\)/);
            var base64Data = new Buffer(result[1], 'base64').toString()
            if (result) {
                res.send({
                    base64: base64Data
                })
            }

        });
    })

});

module.exports = router;