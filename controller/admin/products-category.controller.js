
const ProductsCategory = require("../../model/products-category.model")
const systermConfig = require("../../config/systerm")
const createTreeHelper = require("../../helpers/createTree")

module.exports.index = async (req, res) => {
    const find = {
        deleted :false
    }

    
    const records =  await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    //console.log(newRecords)


    res.render("admin/pages/products-category/index", {
        pageTile: "Danh mục sản phẩm",
        records: newRecords

    })

}

module.exports.create = async (req, res) => {
 
    const find = {
        deleted :false
    }

    
    const records =  await ProductsCategory.find(find)
    const newRecords = createTreeHelper.tree(records)
    //console.log(newRecords)
    res.render("admin/pages/products-category/create",{
        pageTitle: "Tạo danh mục sản phẩm mới",
        records : newRecords

    })
}

module.exports.createPost = async (req, res) => {
    if(req.body.position == ''){
        const count = await ProductsCategory.countDocuments()
        req.body.position = count+1
    }else {
        req.body.position = parseInt(req.body.position)
    }

    const record = new ProductsCategory(req.body)
    await record.save()
    res.redirect(`${systermConfig.prefixAdmin}/products-category`
    )
}


module.exports.edit =async  (req, res) => {
    
    
    
        const find = {
            deleted:false,
            _id : req.params.id
        }
    
        // find tìm nhiều ->[], findOne ->obj
        const record = await ProductsCategory.findOne(find)
        const records = await ProductsCategory.find({deleted:false})
        const newRecords =  createTreeHelper.tree(records)
        
        res.render("admin/pages/products-category/edit",{
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record:record,
            records:newRecords
    
        })
        
    
}

module.exports.editPatch =async  (req, res) => {
    
    
    
    

    req.body.position = parseInt(req.body.position)
    
    if(req.file){

        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    
    try {
        
        await ProductsCategory.updateOne({_id:req.params.id},req.body)
        req.flash("success",`Cập nhật sản phẩm thành công`)
    } catch (error) {
        req.flash("error",`Cập nhật sản phẩm thất bại`)
    }
    res.redirect("back")
}

module.exports.detail =async  (req, res) => {
    
    try {
        
        const find = {
            deleted:false,
            _id : req.params.id
        }
    
        // find tìm nhiều ->[], findOne ->obj
        const record = await ProductsCategory.findOne(find)
        const parentTitle = await ProductsCategory.findOne({_id:record.parent_id})
        //console.log(product)
        
        res.render("admin/pages/products-category/detail",{
            pageTitle: record.title,
            record:record,
            parentTitle: parentTitle.title
            
    
        })
    } catch (error) {
        res.redirect(`${systermConfig.prefixAdmin}/products-category`)
    }
    
}