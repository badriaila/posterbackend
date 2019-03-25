const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/users');

const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required().min(5),
    email: Joi.string().required().email(),
    password: Joi.string().required().regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/),
    termsAndConditions: Joi.boolean().invalid(false).required()    
}

router.post('/',(req,res)=>{
    console.log(req.body);
    const data = Joi.validate(req.body,schema);
    if(!data.error){
        User.get({},(result)=>{
            const uniqUsername = result.find(x => x.username == data.value.username);
            const uniqEmail = result.find(x=>x.email == data.value.email);
            if(uniqUsername){
                res.status(400).send({status:false,response:'username already exists'})
            }else if(uniqEmail){
                res.status(400).send({status:false,response:'email already exists'});
            }else{
                User.create(data.value,(response)=>{
                    const token = jwt.sign({_id:response._id},'private');
                    res.header('x-access-token', token).send({status:true,token:token,response:response})
                })
            }
        })
    }
    else{
        res.status(400).send({status:false,response:data.error.details[0].message})
    }
})

module.exports = router;