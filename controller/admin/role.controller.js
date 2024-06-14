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

module.exports.permission =async (req, res) => {

    let find = {
        deleted:false
    }

    const records = await Role.find(find)
    
    res.render("admin/pages/roles/permission",{

        pageTitle:"Phân quyền",
        records: records
    })
}

module.exports.permissionPatch = async (req, res) => {

    try {
        
        const permission = JSON.parse(req.body.permission)
        for (const item of permission) {
            
            await Role.updateOne({_id:item.id},{permissions:item.perMission})
            
        }
    
        req.flash("success","Cập nhật thành công!")
        
        } catch (error) {
            req.flash("error","Cập nhật thất bại!")
            
        }
            
        res.redirect(`${systermConfig.prefixAdmin}/roles/permission`)
}