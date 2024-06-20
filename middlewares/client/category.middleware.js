const ProductsCategory = require("../../model/products-category.model")

const createTreeHelper = require("../../helpers/createTree")

module.exports.categoryMiddleWare = async(req,res,next)=>{

    const find = {
        deleted :false
    }
    const productsCategory =  await ProductsCategory.find(find)
    const newproductsCategory = createTreeHelper.tree(productsCategory)
    
    res.locals.layoutProductsCategory =newproductsCategory
    next()
}