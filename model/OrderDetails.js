const mongoose = require("mongoose");
const dotenv = require("dotenv");
const addProductSchema =require("./addProductSchema")
const OrderDetails = new mongoose.Schema({
  loggedInEmail: {
    type: String,
    required: true,
  },
  orderTime: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  shipment:[
      {
          name:{
            type: String,
          },
          email:{
            type: String, 
          },
          address:{
            type: String, 
          },
          phone:{
              type:String,
          }
      },

  ],
  products: [{
    type:Object
    
}]



  

     
  
   
 
});

const Order = mongoose.model("ORDERDETAILS",OrderDetails);
module.exports = Order;
