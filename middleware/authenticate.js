const jwt =require('jsonwebtoken');
const Signup =require("../model/signupSchema");

const authenticate =async(req,res,next)=>{
    console.log("hello");
    try{
        const token=sessionStorage.getItem('jwtoken');
        const verifyToken=jwt.verify(token,process.env.JWT_SECRET);
        console.log(token,"ad ",verifyToken);

        const rootUser=await Signup.findOne({_id:veriftyToken._id,"tokens.token":token});
        if(!rootUser){
            throw new Error('User not Found');
        }
        req.token=token;
        req.rootUser=rootUser;
        req.userId=rootUser._id;
        next();

    }
    catch(err){
        res.status(401).send('Unauthorized: No token Provided');
        console.log("desf",err);

    }
}
module.exports=authenticate;