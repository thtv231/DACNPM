module.exports.registerPost = (req,res,next)=>{
    console.log(req.body)
    if(!req.body.fullname){
        return res.json({
            message: "Vui lòng nhập họ tên"
        })
    }
    if(!req.body.email){
        return res.json({
            message: "Vui lòng nhập email"
        })
    }
    if(!req.body.password){
        return res.json({
            message: "Vui lòng nhập mật khẩu"
        })
    }
    next()
}

module.exports.loginPost = (req,res,next)=>{

    if(!req.body.email){
        req.flash("error","Vui lòng nhập email ")
        res.redirect("back")
        return
    }
    if(!req.body.password){
        req.flash("error","Vui lòng nhập mật khẩu ")
        res.redirect("back")
        return
    }
    next()
}