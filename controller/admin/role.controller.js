const Role = require("../../model/roles.model")
const systermConfig=require("../../config/systerm")
module.exports.index =async (req, res) => {

    let find = {
        deleted:false
    }

    const records = await Role.find(find)
    
    res.render("admin/pages/roles/index",{

        pageTitle:"Nhóm quyền",
        records: records
    })
    
}

module.exports.create =async (req, res) => {


    
    res.render("admin/pages/roles/create",{

        pageTitle:"Tạo Nhóm quyền",
       
    })
    
}

module.exports.createPost =async (req, res) => {

    const record = new Role(req.body)
    await record.save()
    
    res.redirect(`${systermConfig.prefixAdmin}/roles`)
    
}