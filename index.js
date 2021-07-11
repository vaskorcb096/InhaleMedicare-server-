const express =require("express");
const dotenv=require("dotenv");
const path=require("path");
const mongoose=require("mongoose");
var cors = require('cors')
const fileUpload=require('express-fileupload')


const app=express();
dotenv.config();
require("./db/connection")
app.use(express.json());
app.use(cors())
app.use(express.static('products'));
app.use(fileUpload());
//we link the router files to make our route easy
app.use(require('./router/auth.js'))
const PORT=process.env.PORT

//datbase connection


//requres process

app.use(express.urlencoded({extended:true}));

app.listen(PORT,()=>{
    console.log(`app listenting to port ${PORT}`);

});




