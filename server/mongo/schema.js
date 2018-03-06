var mongoose = require('mongoose')
var Schema = mongoose.Schema

const bcrypt = require('bcrypt')

var UserDataSchema = new Schema({
    userid: String,
    username: String,
    password: String,
})

UserDataSchema.methods = {
    comparePassword: function(_userPassword, callback) {
        bcrypt.compare(_userPassword, this.password, function(err, isMatch) {
            if (err) {
                return callback(err)
            }
            callback(null, isMatch)
        })
    }
}


module.exports = UserDataSchema