const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/users');

const schema = {
    usernameOrEmail: Joi.string().required().min(5),
    password: Joi.string().required().min(6).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/),
}

router.post('/',(req,res)=>{
    const data = Joi.validate(req.body,schema);
    if(!data.error){
        User.get({},(result)=>{
            const user = result.find(x=>x.email == data.value.usernameOrEmail || x.username == data.value.usernameOrEmail);
            if(user){
                if(user.password == data.value.password){
                    const token = jwt.sign({_id:user._id},'private');
                    res.header('x-access-token', token).send({status:true,token:token,response:'successfully loggedin'});
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