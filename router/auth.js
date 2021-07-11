const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
require("../db//connection"); 
const Contact = require("../model/contactSchema");
const Signup = require("../model/signupSchema");
const Product = require("../model/addProductSchema");
const data = require("../data.js");
const fileUpload = require("express-fileupload");
const ObjectId = require('mongodb').ObjectId;
const fs=require('fs');

const Service = require("../model/serviceSchema");
const Category = require("../model/addCategorySchema");
const Appointment = require("../model/addAppointmentBooking");
const Doctor = require("../model/addDoctor");

router.get("/", (req, res) => {
  res.send(`This is the Home page of Router js `);
});
/* 
using promises

router.post ('/contact',(req,res)=>{
    const {name,email,message}=req.body;
    console.log(name)
    if(!name || !email || !message) {
        return res.status(422).json({error:"Plz filled the field Properly"});
    }
    const contact =new Contact ({name,email,message});
    contact.save().then(()=>{
        res.status(201).json({message: "You send messaged successfully"})
    }).catch((err) => res.status(500).json({error:"Failed to send Message.plz try again letter"}))
   
})
 */
//using async await
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  //console.log(name);
  if (!name || !email || !message) {
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: "You send messaged successfully" });
  } catch (err) {
    console.log(err);
  }
});
//servive section
router.post("/serviceSection", async (req, res) => {
 // console.log(req.body,"ad");
  const file = req.files.file;
  const filePath = `${__dirname}/../services/${file.name}`;
  const image=file.name;
  console.log(image);
 // console.log(req.body.title, file);

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    title,
    description,llink
  } = req.body;

  if (
    !title ||
    !description || !llink
  ) {
    console.log("df");
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {

    const servicesec = new Service({
      title,
      description,
      image,
      llink,
      
     
    });
    await servicesec.save();
    res.status(201).json({ message: "You send messaged successfully" });
  } catch (err) {
    console.log(err);
  }
});
//promises signup version
/*

router.post('/register',(req,res)=>{
    const {username,email,password,cppassword} =req.body;
    if(!username || !email || !password || !cppassword) {
        return res.status(422).json({error:"Plz filled the field Properly"})
    }
    Signup.findOne({email:email})
          .then((userExist)=>{
              if(userExist) {
                  return res.status(422).json({error:"Email already exist"});

              }
              const signup =new Signup({username,email,password,cppassword});
              signup.save()
                    .then(()=>{
                        res.status(201).json({message:"user registered Successfully"})
                    }).catch((err)=>res.status(500).json({error:"Failed to register"}))

                    

          }).catch(err=>{console.log(err);});



})
*/

//async await register

router.post("/register", async (req, res) => {
  const { user_name, email, password, cppassword, date } = req.body;
  if (!user_name || !email || !password || !cppassword) {
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const userExist = await Signup.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password !== cppassword) {
      return res.status(422).json({ error: "Password are not matched" });
    } else {
      const signup = new Signup({
        user_name,
        email,
        password,
        cppassword,
        date,
      });
      await signup.save();
      res.status(201).json({ message: "user registered Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Plz Filled the data " });
    }
    userLogin = await Signup.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      // create jwt token
      token = await userLogin.generateAuthToken();
      console.log("jwt ", token);

      //expires:new Date(Date.now()+25892000000),

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credientials" });
      } else {
        res.status(200).json({ message: "user login Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credientials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//about page
router.get("/aboutme", (req, res) => {
  //console.log("Hello about");
  res.send("hello ");
});
//appointment add korar jonno
router.post('/appointment',async(req,res)=>{
  console.log()
  const { firstname, lastname, contactNumber,email,preferredDoctors,purposeOfAppointment,date,time } = req.body;
  try{
    const appointment = new Appointment({
      firstname,
      lastname,
      contactNumber,
      email,
      preferredDoctors,
      purposeOfAppointment,
      date,
      time,
      status:'pending',
     
    })
    await appointment.save();
    res.status(201).json({ message: "You send messaged successfully" });

    }catch(err){
      console.log(err);

  }
  
})

//product database a patbar jonno
router.post("/addDoctor", async (req, res) => {
  const file = req.files.file;
  const filePath = `${__dirname}/../products/${file.name}`;
  const image=file.name;

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    name,
    description,
    department
  } = req.body;
  if (
    !name ||
    !description ||
    !department
  ) {
    console.log("df");
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const doctor = new Doctor({
      name,
      description,
      department,
      image,
     
    });
    await doctor.save();

    res.status(201).json({ message: "You Created Doctors Profile  successfully" });
  } catch (err) {
    console.log(err);
  }
});
//doctor add korar jonno
router.post("/addProduct", async (req, res) => {
  const file = req.files.file;
  const filePath = `${__dirname}/../products/${file.name}`;
  const image=file.name;

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    name,
    Category,
    price,
    countInStock,
    brand,
    numReviews,
    description,
  } = req.body;
  console.log("ssdf", name, Category, price, countInStock);
  if (
    !name ||
    !Category ||
    !price ||
    !countInStock ||
    !brand ||
    !numReviews ||
    !description
  ) {
    console.log("df");
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const product = new Product({
      name,
      Category,
      price,
      countInStock,
      brand,
      numReviews,
      description,
      image,
     
    });
    await product.save();

    res.status(201).json({ message: "You send messaged successfully" });
  } catch (err) {
    console.log(err);
  }
});

//category add korar jonno 
router.post("/addCategory", async (req, res) => {

  const {
    
    category,
  } = req.body;
  //console.log("drg",category);
  if (

    !category 
  ) {
    console.log("df");
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const ccategory = new Category({
    
      category,
      
    
    });
    await ccategory.save();

    res.status(201).json({ message: "You send messaged successfully" });
  } catch (err) {
    console.log(err);
  }
});


//product databse teke kuje anar jonno
router.get("/api/products", async(req, res) => {
  const products=await Product.find({})
  res.send(products);
});
router.get('/products',async(req,res)=>{
  /* Product.find({}).toArray((err,documents)=>{
     console.log(documents);
     res.send(documents);
   })*/
  const products=await Product.find({})
  //console.log(products);
  res.send(products);

})
router.get('/category',async(req,res)=>{
  console.log("sdf",req.body);
 
  const categorys=await Category.find({})
 
  res.send(categorys);

})
router.get('/servicedata',async(req,res)=>{
  const service=await Service.find({})
  //console.log(service);
  res.send(service);

})
router.get("/api/product/:id", async(req, res) => {
 // console.log(JSON.stringify(req.params.id)," ad ",typeof(req.params.id));
  const product=await Product.findById(req.params.id);
  if(product) {
    res.send(product);
  }
  else {
    res.status(404).send({message:"Product Not Found"});

  }
});
router.get('/getAppointment',async(req,res)=>{

  const appointments=await Appointment.find({})
  console.log("app",appointments);
 
  res.send(appointments);

})

router.get('/getTodayAppointment',async(req,res)=>{
  const s=new Date().toDateString();
  const todayAppointment=await Appointment.find({date:s})

 
  res.send(todayAppointment);

})
router.get('/getSuccessfullAppointment',async(req,res)=>{

  const todayAppointment=await Appointment.find({status:'Done'})

 
  res.send(todayAppointment);

})
router.get('/getPendingAppointment',async(req,res)=>{

  const todayAppointment=await Appointment.find({status:'pending'})

 
  res.send(todayAppointment);

})
router.get('/getDoctor',async(req,res)=>{

  const doctors=await Doctor.find({})
  //console.log("app",appointments);
 
  res.send(doctors);

})

router.post('/getByproducts', async(req, res) => {
  //console.log("lagbe",req.body);
  const productKeys = req.body;
  const product=await Product.find({_id: { $in: productKeys} });
  console.log("data",product);
      res.send(product);
})
//product delete korar jonno 
router.delete('/deleteOneProduct/:id',async(req,res)=>{
  console.log(req.body);
  await Product.deleteOne({_id:req.params.id},(err)=>{
    if(err) {
      res.status(500).json({error:'Server Side Error'});

    }
    else {
      res.status(200).json({message:"Successfully "})
    }
  })

})
//doctor delete korar jonno
router.delete('/deleteOneDoctor/:id',async(req,res)=>{
  console.log(req.body);
  await Doctor.deleteOne({_id:req.params.id},(err)=>{
    if(err) {
      res.status(500).json({error:'Server Side Error'});

    }
    else {
      res.status(200).json({message:"Successfully "})
    }
  })

})

//service delete korar jonno 
router.delete('/deleteOneService/:id',async(req,res)=>{
  console.log(req.body);
  await Service.deleteOne({_id:req.params.id},(err)=>{
    if(err) {
      res.status(500).json({error:'Server Side Error'});

    }
    else {
      res.status(200).json({message:"Successfully "})
    }
  })

})

router.patch('/productUpdate/:id', async(req, res) => {
  const file = req.files.file;
  const filePath = `${__dirname}/../products/${file.name}`;
  const image=file.name;

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    name,
    Category,
    price,
    countInStock,
    brand,
    numReviews,
    description,
  } = req.body;
 
    await Product.updateOne({_id:req.params.id},
      {$set: {
        name:name,
        Category:Category,
        price:price,
        countInStock: countInStock, 
        brand:brand,
        numReviews:numReviews,
        description:description,
        image:image

      }},
      (err)=>{
        if(err) {
          res.status(500).json({error:"There was a server side error "})
        }
        else {
          res.status(200).json({Message:"Successfully Updated Product "})
        }
      }


      )
})
//service update

router.patch('/serviceUpdate/:id', async(req, res) => {
  const file = req.files.file;
  const filePath = `${__dirname}/../products/${file.name}`;
  const image=file.name;

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    title,
    description,
    llink,
  } = req.body;
 
    await Service.updateOne({_id:req.params.id},
      {$set: {
        title:title,
        description:description,
        llink:llink,
        image:image

      }},
      (err)=>{
        if(err) {
          res.status(500).json({error:"There was a server side error "})
        }
        else {
          res.status(200).json({Message:"Successfully Updated Service "})
        }
      }


      )
})

router.patch('/updateAppointmentStatus', async(req, res) => {
  const { id, status } = req.body;
  console.log(req.body);
  await Appointment.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
          $set: { status },
      },{
        useFindAndModify:false,
        new:true,
      }
  ).then(result => res.send())
})





module.exports = router;
