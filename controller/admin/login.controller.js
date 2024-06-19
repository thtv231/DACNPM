const Account = require("../../model/acounts.model")
const systermConfig=require("../../config/systerm")
const md5 = require('md5')
module.exports.login =(req, res) => {
    
    if(req.cookies.token){
        res.redirect(`${systermConfig.prefixAdmin}/dashboard`)
    }else{

        res.render("admin/pages/auth/login",{
            pageTitle: "Đăng nhập"
        }) 
    }
    

    
    
}

module.exports.loginPost = async (req, res) => {
    
    const email = req.body.email
    const password = req.body.password
    
    const user =await Account.findOne({
        email:email,
        deleted:false
    })
    

    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect("back")
        return
    }
    if(md5(password)!=user.password){
        req.flash("error","Mật khẩu không chính xác")
        res.redirect("back")
        return
    }

    if(user.status !="active"){
        req.flash("error","Tài khoản đã bị khóa")
        res.redirect("back")
        return
    }

    
    
    res.cookie("token",user.token)
    res.redirect(`${systermConfig.prefixAdmin}/dashboard`)
}

module.exports.logout =(req, res) => {
    res.clearCookie("token")
    
    res.redirect(`${systermConfig.prefixAdmin}/auth/login`)
}