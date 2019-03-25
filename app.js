const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const cors = require('cors');
const controllers = require('./controllers');

mongoose.connect('mongodb://localhost/posters');
const db = mongoose.connection;
db.on('error', error=> console.log(error));
db.once('open',()=>console.log('mongodb connected'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(controllers);


const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`app running on port ${port}`));