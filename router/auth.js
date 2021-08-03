const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
require("../db//connection"); 
const Contact = require("../model/contactSchema");
const Signup = require("../model/signupSchema");
const Product = require("../model/addProductSchema");
const nodemailer = require("nodemailer");
const dotenv=require("dotenv");
const data = require("../data.js");
const fileUpload = require("express-fileupload");
const ObjectId = require('mongodb').ObjectId;
const fs=require('fs');
const stripe =require("stripe")("sk_test_51JEIJkK8csuOv1BYjdtEt6224PS2Qmpkznf8AlKKcDjXbDebRrK5JoLYU41Vn18lQjWzZ8OjoGo4R6RcZ71ZN2aa00IbYrjGdE")
const Service = require("../model/serviceSchema");
const Category = require("../model/addCategorySchema");
const Appointment = require("../model/addAppointmentBooking");
const Doctor = require("../model/addDoctor");
const Order = require("../model/OrderDetails");
const Admin = require("../model/admin");
const Review = require("../model/reviewItemSchema");
const PASS=process.env.PASS;
const EMAIL=process.env.EMAIL
console.log(PASS, "dfg","EMAIL",EMAIL);
router.get("/", (req, res) => {
  res.send(`This is the Home page of Router js `);
});

//payement gateway
router.post("/payment",(req,res)=>{
  console.log("body",req.body);

  const {product,token}=req.body;
  console.log(typeof(product.price));
  return stripe.customers.create({
    email:token.email,
    source:token.id
  }).then(customer=>{
    stripe.charges.create({
      amount:product.price*100,
      currency:'usd',
      customer:customer.id,
      receipt_email:token.email,
      description:`purchase of ${product.productBuy}`,
      shipping:{
        name:token.card.name,
        address:{
          country:token.card.address_country
        }
      },

    })
  })
  .then(result=>{
    const output = `
    <p>You have a new contact request</p>
    <h3>Product Details</h3>
    <ul>  
      <li>ID: ${token.card.id}</li>
      <li>Payment Method: ${token.card.brand}</li>
      <li>Email: ${product.productBuy}</li>
      <li>Price: ${product.price}</li>
    </ul>
    <h3>Message</h3>
    <p>Thank Your Chooce Our Product</p>
  `;

  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
       port: 465,
       secure: false,
      service: 'gmail',
      auth: {
        user:`${process.env.EMAIL}`,
        pass: `${process.env.PASS}` // naturally, replace both with your real credentials or an application-specific password
      }
    });
    
    const mailOptions = {
      from: 'shurjocb11@gmail.com',
      to: `${product.productBuy}`,
      subject: 'Payment Details',
      text: 'Medibazar .',
      html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
    res.status(200).json(result);
  })
  .catch(err=>console.log(err))
})
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
        user_details:"",
        user_profession:"",
        parmanent_address:"",
        current_address:"",
        email,
        password,
        cppassword,
        date,
        image:'null',
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
      status:'Pending',
     
    })
    await appointment.save();
    res.status(201).json({ message: "You send messaged successfully" });
    const output = `
    <p>You have a new Appointment request</p>
    <h3>Appointmentt  Details</h3>
    <ul>  
      <li>Name: ${firstname} ${lastname}</li>
      <li>Email: ${email}</li>
      <li>Doctors: ${preferredDoctors}</li>
      <li>Appointment Date: ${date}</li>
    </ul>
    <h3>Message</h3>
    <p>Thank you</p>
  `;

  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
       port: 465,
       secure: false,
      service: 'gmail',
      auth: {
        user:`${process.env.EMAIL}`,
        pass: `${process.env.PASS}` // naturally, replace both with your real credentials or an application-specific password
      }
    });
    
    const mailOptions = {
      from: 'shurjocb11@gmail.com',
      to: `${email}`,
      subject: 'Appointment Details',
      text: 'Inahle Medibazar .',
      html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    

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

//review add korar jonno
router.post("/addReview", async (req, res) => {
  
  const {
    title,
    description,
    image,
    user_name,
    date
 
  } = req.body;
  console.log("srg",req.body);
  if (
    !title ||
    !description ||
    ! image ||
    !user_name
  ) {
    console.log("df");
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const review = new Review({
      title,
      description,
      image,
      user_name,
      date
     
    });
    await review.save();

    res.status(201).json({ message: "You add Review Successfully" });
  } catch (err) {
    console.log(err);
  }
});

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
//order add korar jonno
router.post("/addOrder", async (req, res) => {
  const {
    loggedInEmail,
    shipment,
    orderTime,
    products,
    productPrice
   
  } = req.body;
  console.log("Products",products,"dsfg",productPrice);
 
  try {
    const order = new Order({
      loggedInEmail,
      shipment,
      orderTime, 
      products,
      productPrice
     
      
    }
    );
   
    await order.save();

    res.status(201).json({ message: "You send Order successfully" });
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
//addmin add korar jonno

router.post("/addAdmin", async (req, res) => {

  const {
    
    email,
  } = req.body;
  //console.log("drg",category);
  if (

    !email 
  ) {
    console.log("admin");
    return res.status(422).json({ error: "Plz filled the field Properly" });
  }
  try {
    const aadmin = new Admin({
    
      email,
      
    
    });
    await aadmin.save();

    res.status(201).json({ message: "You send messaged successfully" });
  } catch (err) {
    console.log(err);
  }
});


//product databse teke kuje anar jonno

router.get('/getAboutMe',async(req,res)=>{
 console.log("st");
  const info=await Signup.find({})
  console.log("getAboutMe",info);
 
  res.send(info);

})
//get Review
router.get('/getReview',async(req,res)=>{
  console.log("st");
   const info=await Review.find({})
   console.log("getrevieww",info);
  
   res.send(info);
 
 })
//addmin get
router.get('/getAdmin',async(req,res)=>{
  console.log("admin get");
   const info=await Admin.find({})
   console.log("getAdmin",info);
  
   res.send(info);
 
 })
//orders get 
router.get('/getOrders',async(req,res)=>{
  console.log("orders");
   const orderInfo=await Order.find({})
   console.log("getordersinfo",orderInfo);
  
   res.send(orderInfo);
 
 })
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
router.get('/getContact',async(req,res)=>{
  const contact=await Contact.find({})
  console.log(contact);
  res.send(contact);

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

router.get("/product/productFindById/:id", async(req, res) => {
  // console.log(JSON.stringify(req.params.id)," ad ",typeof(req.params.id));
   const product=await Product.findById(req.params.id);
   console.log("fgfggfggg");
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
  console.log(s);
  const todayAppointment=await Appointment.find({date:s})

 
  res.send(todayAppointment);

})
router.get('/getSuccessfullAppointment',async(req,res)=>{

  const todayAppointment=await Appointment.find({status:'Done'})

 
  res.send(todayAppointment);

})
router.get('/getPendingAppointment',async(req,res)=>{

  const todayAppointment=await Appointment.find({status:'Pending'})

 
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
//prodduct Review Update
router.patch('/product/productUpdateOne/:id',(req, res) => {

  
  const {
   post,email,date,image, user_name
  } = req.body;
  const review ={
    post:post,
    email:email,
    date:date,
    image:image,
    user_name:user_name
  }
  console.log("sfdgfdg",review);
 
     Product.findOneAndUpdate({_id:req.params.id},
      {$push: {
        
        productReview:review

      }},{useFindAndModify: false},
     
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
//profile update
router.patch('/profileUpdate/:email', async(req, res) => {
  const file = req.files.file;
  const filePath = `${__dirname}/../products/${file.name}`;
  const image=file.name;
 console.log("sdfxxx",image);

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    user_name,
    user_profession,
    parmanent_address,
    current_address,
    user_details,
  
  } = req.body;
 
    await Signup.updateOne({email:req.params.email},
      {$set: {
        user_name:user_name,
        user_profession:user_profession,
        parmanent_address:parmanent_address,
        
        current_address:current_address,
        user_details:user_details,
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

//doctor update

router.patch('/doctorUpdate/:id', async(req, res) => {
  const file = req.files.file;
  const filePath = `${__dirname}/../products/${file.name}`;
  const image=file.name;
  console.log("sdggf");

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ messgae: "Failed to Upload Image" });
    } 
    
  });
  const {
    name,
    description,
    department,
  } = req.body;
 
    await Doctor.updateOne({_id:req.params.id},
      {$set: {
        name:name,
        description:description,
        department:department,
        image:image

      }},
      (err)=>{
        if(err) {
          res.status(500).json({error:"There was a server side error "})
        }
        else {
          res.status(200).json({Message:"Successfully Updated Dcotros "})
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
