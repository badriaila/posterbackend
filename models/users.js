const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    username:String,
    email:String,
    password:String,
    termsAndConditions:String,
    createdDate:{type:Date, default:new Date()}
})

const User = mongoose.model('User', userSchema );

exports.create = async function (req,callback) {
    const user = new User(req)
    const response = await user.save();
    callback(response);
}

exports.get = async function (req,callback){
    User.find(req.match,req.fields,(err,response)=>{
        callback(response);
    })
}

exports.update = async function (req,callback){
    User.update(req.match,req.fields,(err,response)=>{
        callback(response);
    })
}

exports.delete = async function (req,callback){
    User.remove(req,(err,response)=>{
        callback(response);
    })
}