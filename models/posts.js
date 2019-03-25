const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:String,
    message:String,
    postedDate:{type:Date, default:new Date()},
    postedBy:String
})

const Post = mongoose.model('Post', postSchema);

exports.create = async function (req,callback) {
    const post = new Post(req);
    const result = await post.save();
    callback(result);
}

exports.get = async function (req,callback){
    Post.find(req.match,req.fields,(err,response)=>{
        callback(response.reverse());
    })
}

exports.update = async function (req,callback){
    Post.update(req.match,req.fields,(err,response)=>{
        callback(response);
    })
}

exports.delete = async function (req,callback) {
    Post.remove(req,(err,response)=>{
        callback(response)
    })
}