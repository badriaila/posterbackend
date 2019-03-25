const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const Joi = require('joi');
const User = require('../models/users');

const emailSchema = {
    email: Joi.string().required().email()
}
const passwordSchema = {
    password: Joi.string().required().min(6).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
}

router.post('/', (req,res)=>{
    const data = Joi.validate(req.body,emailSchema);
    if(!data.error){
        User.get({},(result)=>{
            const details = result.find(x=> x.email == data.value.email)
            if(details){
                const token = jwt.sign({_id:details._id,exp:new Date().getTime() /1000 + (15*60)},'private');
                res.send({status:true,response:`http://localhost:4200/resetpassword/?token=${token}`});
            }else{
                res.status(404).send({status:false,response:'no account found with this email'})
            }
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

router.put('/', auth, (req,res)=>{
    const data = Joi.validate(req.body,passwordSchema);
    if(!data.error){
        User.update({match:{_id:req.user._id},fields:{$set:{password:data.value.password}}},(response)=>{
            res.send({status:true,response:response})
        })
    }else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

module.exports = router;