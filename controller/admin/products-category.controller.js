
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

