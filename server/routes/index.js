var express = require('express');
var router = express.Router();

var http = require('http');
var qs = require('querystring');

var book_url = require('./../data/book1.json').url
var book_path = require('./../data/book1.json').path
var book_list_url = require('./../data/book1.json').allList_url
var book_list_path = require('./../data/book1.json').allList_path

var capter_options = {
    host: book_url,
    port: 80,
    path: book_path,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};



/* GET capter. */
router.get('/capter', (req, res, next) => {

    var resData = "";

    var data = http.get(capter_options, response => {
        response.on('data', chunk => {
            resData += chunk;
        })
        response.on("end", () => {
            var result = resData.match(/\(([^)]*)\)/);
            var base64Data = new Buffer(result[1], 'base64').toString()
            if (result) {
                res.send(base64Data)
            }

        });
    })

});

var list_options = {
    host: book_list_url,
    port: 80,
    path: book_list_path,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

router.get('/list', (req, res) => {
    var resData = "";

    var data = http.get(list_options, response => {
        response.on('data', chunk => {
            resData += chunk;
        })
        response.on("end", () => {
            res.send(resData)
        });
    })
})

module.exports = router;