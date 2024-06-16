const Account = require("../../model/acounts.model")
const Role = require("../../model/roles.model")
const systermConfig=require("../../config/systerm")
const md5= require('md5')
module.exports.index =async (req, res) => {
    const find = {
        deleted: false

    }
    const records = await Account.find(find).select("-password -token")
   
    for (const record of records) {
        const role = await Role.findOne({
            deleted:false,
            _id:record.role_id
        })
        record.role = role
        
        
    }
   
    
    res.render("admin/pages/accounts/index",{

        pageTitle:"Danh sách tài khoản",
        records:records
        
        
    })
    
}

module.exports.create =async (req, res) => {

    const roles = await Role.find({
        deleted:false
    })
    
    res.render("admin/pages/accounts/create",{

        pageTitle:"Tạo mới tài khoản",
        roles:roles
        
    })
    
}

module.exports.createPost =async (req, res) => {

    req.body.password = md5(req.body.password)
    

    const emailExits = await Account.findOne({
        deleted:false,
        email: req.body.email
    })
    if(emailExits){
        req.flash("error",`Email ${req.body.email} đã tồn tại!!`)
        res.redirect("back")

    }else{

        const record =new Account(req.body)
        
        await record.save()
        //req.flash("success","Tài khoản đã được tạo thành công")
        
        res.redirect(`${systermConfig.prefixAdmin}/accounts`)
    }

    
}

module.exports.edit =async (req, res) => {

    const id = req.params.id
    const record = await Account.findOne({
        _id:id,
        deleted:false
    })
    const roles = await Role.find({
        deleted:false
    })
    res.render("admin/pages/accounts/edit",{

        pageTitle:"Cập nhật tài khoản",
        record: record,
        roles:roles
        
    })
    
}

module.exports.editPatch =async (req, res) => {

    const id = req.params.id
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