const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const token = req.query.token || req.header('x-access-token');
    if(!token){
        res.status(400).send({status:false,response:'please provide token'});
        return;
    }
    else{
        try{
            req.user = jwt.verify(token,'private');
            next();
        }
        catch(ex){
            res.status(400).send({status:false,response:'invalid token'});
        }
    }
}
