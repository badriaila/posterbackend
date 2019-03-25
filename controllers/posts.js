const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Joi = require('joi');
const Post = require('../models/posts');

//Joi schemas
const postSchema = {
    title: Joi.string().required().min(15),
    message: Joi.string().required().min(150),
    postedBy: Joi.string()
}
const updateSchema = {
    _id: Joi.string().required(),
    title: Joi.string().required().min(15),
    message: Joi.string().required().min(150),
}

//Routes
router.get('/', auth, (req,res)=>{
    Post.get({},(response)=>{
        res.send({status:true,response:response})
    })
})

router.post('/', auth, (req,res)=>{
    const data = Joi.validate(req.body,postSchema);
    if(!data.error){
        Post.get({},(result)=>{
            const exists = result.find(x => x.title == data.value.title)
            if(!exists){
                data.value.postedBy = req.user._id;
                Post.create(data.value,(response)=>{
                    res.send({status:true,response:response})
                })
            }else{
                res.status(400).send({status:false,response:'title already exists'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

router.put('/', auth, (req,res)=>{
    const data = Joi.validate(req.body,updateSchema);
    if(!data.error){
        Post.get({match:{postedBy:req.user._id}},(result)=>{
            const exists = result.find(x=> x._id == data.value._id);
            if(exists){
                Post.update({match:{_id:data.value._id},fields:{$set:{title:data.value.title,message:data.value.message}}},(response)=>{
                    res.send({status:true,response:response});
                })
            }else{
                res.status(404).send({status:false,response:'this post not found on your list'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

router.delete('/:id', auth, (req,res)=>{
    const data = Joi.validate(req.params,{id : Joi.string().required()});
    if(!data.error){
        Post.get({match:{postedBy:req.user._id}},(result)=>{
            const exists = result.find(x=> x._id == data.value.id);
            if(exists){
                Post.delete({_id:data.value.id},(response)=>{
                    res.send({status:true,response:response});
                })
            }else{
                res.status(404).send({status:false,response:'this post not found on your list'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

module.exports = router;