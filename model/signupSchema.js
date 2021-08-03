const mongoose =require('mongoose');
require("dotenv").config();
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')
const signupSchema=new mongoose.Schema({
    user_name:{
        type:String,
        required:true

    },
    user_details:{
        type:String,
        default:"Filled This Filled", 
    },
    user_profession:{
        type:String,  
        default:"Filled This Filled", 
    },
    email:{
        type:String,
        required:true,
    },
    password :{
        type:String,
        required:true

    },
    parmanent_address:{
        type:String,
        default:"Filled This Filled", 
       
    },
    current_address:{
        type:String,
        default:"Filled This Filled", 
      
    },
    cppassword:{
        type:String,
        required:true
    },
    tokens:[
        {
           token:{
            type:String,
            required:true  
           } 
        }
    ],
    date:{
        type:Date,
        default:Date.now,

    },
    image:{
        type:String,
    }
})

//hasing the password

signupSchema.pre('save',async function(next){
    if(this.isModified('password')){
            this.password=await bcrypt.hash(this.password,12);
            this.cppassword=await bcrypt.hash(this.cppassword,12);

    }
    next();
}) 

//we are generating token
signupSchema.methods.generateAuthToken=async function (){
    try{
        console.log(process.env.JWT_SECRET);
        let token =jwt.sign({_id:this._id},process.env.JWT_SECRET);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return  token;

    }catch(err) {
        console.log(err);
    }
}
const Signup= mongoose.model("SIGNUPINFO",signupSchema);
module.exports=Signup;


