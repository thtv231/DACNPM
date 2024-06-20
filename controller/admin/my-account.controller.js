const Account = require("../../model/acounts.model")
const Role = require("../../model/roles.model")
const systermConfig=require("../../config/systerm")
const md5= require('md5')

module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index",{

        pageTitle:"Thông tin cá nhân",  
        
    })
}

module.exports.edit = (req, res) => {
    
    res.render("admin/pages/my-account/edit",{

        pageTitle:"Chỉnh sửa thông tin cá nhân",  
        
    })
}

module.exports.editPatch =async (req, res) => {

    
    const id = res.locals.user.id
    const emailExits = await Account.findOne({
        _id: {$ne: id},
        deleted:false,
        email: req.body.email
    })
    if(emailExits){
        req.flash("error",`Email ${req.body.email} đã tồn tại!!`)
        res.redirect("back")

    }else{

        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        await Account.updateOne({_id:id},req.body)
        
        req.flash("success","Cập nhật thành công")
        res.redirect(`${systermConfig.prefixAdmin}/accounts`)
    }
    

    
}