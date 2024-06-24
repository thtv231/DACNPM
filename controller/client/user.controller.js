const User = require("../../model/users.model")
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