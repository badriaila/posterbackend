const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Joi = require('joi');
const User = require('../models/users');
const Post = require('../models/posts');

// Joi Validating Schemas
const emailSchema = {
    email: Joi.string().required().email()
}

const passwordSchema = {
    oldPassword : Joi.string().required().min(6).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/),
    newPassword : Joi.string().required().min(6).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
}

    const password = Joi.string().required().min(6).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)

// Routes
router.get('/', auth, (req,res)=>{
    User.get({match:{},fields:{password:0,termsAndConditions:0}},(response)=>{
        res.send({status:true,response:response});
    })
})

router.get('/myprofile', auth, (req,res)=>{
    User.get({match:{_id:req.user._id},fields:{termsAndConditions:0}},(response)=>{
        res.send({status:true,response:response});
    })
})

router.put('/email', auth, (req,res)=>{
    const data = Joi.validate(req.body,emailSchema);
    if(!data.error){
        User.get({},(result)=>{
            const profile = result.find(x => x._id == req.user._id);
            if(profile){
                User.update({match:{_id:req.user._id},fields:{$set:{email:data.value.email}}},(response)=>{
                    res.send({status:true,response:response})
                })
            }else{
                res.status(404).send({status:false,response:'account not found'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

router.put('/password', auth, (req,res)=>{
    const data = Joi.validate(req.body,passwordSchema);
    if(!data.error){
        User.get({},(result)=>{
            const profile = result.find(x => x._id == req.user._id);
            if(profile){
                if(profile.password == data.value.oldPassword){
                    User.update({match:{_id:req.user._id},fields:{$set:{password:data.value.newPassword}}},(response)=>{
                        res.send({status:true,response:response})
                    })
                }else{
                    res.status(400).send({status:false,response:'old password wrong'})
                }
            }else{
                res.status(404).send({status:false,response:'account not found'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

router.delete('/:password', auth, (req,res)=>{
    const data = Joi.validate(req.params.password,password);
    if(!data.error){
        User.get({},(result)=>{
            const profile = result.find(x => x._id == req.user._id);
            if(profile){
                if(profile.password == data.value){
                    const data = {usersDeleted:false,postsDeleted:false}
                    User.delete({_id:req.user._id},(response)=>{
                        data.usersDeleted = true;
                    })
                    Post.delete({postedBy:req.user._id},(response)=>{
                        data.postsDeleted = true;
                    })
                    res.send({status:true,response:data});
                }else{
                    res.status(400).send({status:false,response:'wrong password'})
                }
            }else{
                res.status(404).send({status:false,response:'account not found'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

module.exports = router;