const Order = require("../../model/orders.model")
const Product = require("../../model/products.model")
const User = require("../../model/users.model")
const productHelper = require("../../helpers/products")

const md5 = require("md5")
module.exports.register =async (req,res)=>{
    


    //console.log(cart)
    res.render("client/pages/user/register",
        {
            pageTitle: "Đăng ký tài khoản",
            
           
        }
    )
}

module.exports.registerPost =async (req,res)=>{
    
    //console.log(req.body)
    const existEmail = await User.findOne({
        email: req.body.email
    })

    if(existEmail){
        req.flash("error","Email đã tồn tại ")
        res.redirect("back")
        return
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser",user.tokenUser)
    
    res.redirect("/")
}

module.exports.login =async (req,res)=>{
    
    res.render("client/pages/user/login",
        {
            pageTitle: "Đăng nhập tài khoản",
            
           
        }
    )
}

module.exports.loginPost =async (req,res)=>{
    
   const email = req.body.email
   const password = req.body.password
   const user = await User.findOne({
    email: email,
    deleted: false
   })
   if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect("back")
        return
   }

   if(md5(password)!=user.password){
        req.flash("error","Sai mật khẩu")
        res.redirect("back")
        return
    }

    if(user.status =="inactive"){
        req.flash("error","Tài khoản đã bị khóa")
        res.redirect("back")
        return
    }

    res.cookie("tokenUser", user.tokenUser)


    res.redirect("/")
}

module.exports.logout = (req,res)=>{
    
    res.clearCookie("tokenUser")
 
 
    res.redirect("/")
 }

 module.exports.history =async (req,res)=>{
    
    const orders = await Order.find({
        
        user_id: req.cookies.tokenUser
    })

   // console.log(orders)
    for (const order of orders) {
        
        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("title thumbnail slug")
        
            product.productInfo = productInfo
            product.priceNew = productHelper.priceNewProduct(product)
            product.totalPrice = product.priceNew*product.quantity
        }

        order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)


    }

    

    
    res.render("client/pages/user/history",
        {
            pageTitle: "Đơn mua",
            orders: orders
           
        }
    )
}


