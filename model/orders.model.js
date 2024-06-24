
const mongoose = require("mongoose")




const orderSchema = new mongoose.Schema({
    // user_id
    cart_id: String,
    userInfo : {
        fullName : String,
        phone: String,
        address: String
    },
    prodcuts :[
        {
            product_id: String,
            price: Number,
            discountPercentage : Number,
            quantity: Number
        }
        
    ]
   
    
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema,"orders")

module.exports = Order
