const Products = require("../../model/products.model.js")
const ProductsCategory = require("../../model/products-category.model.js")
const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js")
const paginationHelper = require("../../helpers/pagination.js")
const systermConfig = require("../../config/systerm.js")
const createTree = require("../../helpers/createTree.js")
module.exports.prodcuts = async (req, res) => {
    
    const filterStatus = filterStatusHelper(req.query)

    const find = {
        deleted :false
    }

    if(req.query.status){
       

        find.status = req.query.status
    }


    const objSearch = searchHelper(req.query)

    if(objSearch.regex){

        
        find.title = objSearch.regex
    }


    // pagination 
    // let objPagination = {
    //     limitItems : 4,
    //     currentPage:1

    // }

    // if(req.query.page){
    //     objPagination.currentPage = parseInt(req.query.page)
    // }

    // objPagination.skip = (objPagination.currentPage-1)*objPagination.limitItems
    // const countProduct =await Products.countDocuments(find)
    // objPagination.totalPage = Math.ceil(countProduct/objPagination.limitItems)
    const countProduct =await Products.countDocuments(find)
    let objPagination = paginationHelper(req.query,countProduct)
    

    // pagination 




    //sort
    let sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{

        sort.position = "desc"
    }

    //sort end
    
    


    const products =  await Products.find(find)
        .sort(sort)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip)
   
    
    //console.log(prodcuts)
    res.render("admin/pages/products/index",{
        products : products,
        filterStatus:filterStatus,
        keyword:objSearch.keyword,
        pagination :objPagination

    })
        
    
}

// changeStatus

module.exports.changeStatus = async(req,res)=>{
    
    const status = req.params.status
    const id = req.params.id
    await Products.updateOne({_id:id},{status:status})
    
    req.flash("success", "Cập nhật trạng thái thành công")
    res.redirect("back")
}

module.exports.changeMultiStatus =async (req,res) =>{
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    switch (type) {
        case "active":
            await Products.updateMany({_id:{$in:ids}},{status:type})
            req.flash("success", `Cập nhật trạng thái ${type} ${ids.length} sản phẩm`)
            break;
        case "inactive":
            await Products.updateMany({_id:{$in:ids}},{status:type})
            req.flash("success", `Cập nhật trạng thái ${type} ${ids.length} sản phẩm`)
            
            
            break; 
        case "delete":
                await Products.updateMany({_id:{$in:ids}},{
                    deleted:true,
                    deletedAt:new Date()
                })
                req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`)

                break;
        case "change-position":
                
                for(const item of ids){
                    let [id,position] =item.split("-")
                    position= parseInt(position)
                    await Products.updateOne({_id:id},{position:position})
                }
                req.flash("success", `Đã thay đổi vị trí  ${ids.length} sản phẩm`)

                break;                 
    
        default:
            break;
    }
    
    res.redirect("back")


}


// changeStatus new

//delete item
module.exports.deleteItem = async (req,res)=>{
    const id = req.params.id
    // xóa vĩnh viễn sản phẩm
    //await Products.deleteOne({_id:id})
    // xóa mềm cập nhật lại trạng thái deleted của bản ghi băng true
    try {
        
        await Products.updateOne({_id:id},{
            deleted:true,
            deletedAt:new Date()
        })
        req.flash("success","Xóa sản phẩm thành công")
    } catch (error) {
        req.flash("error","Xóa sản phẩm thất bại") 
    }

    res.redirect("back")
}
//delete item end


// create item

module.exports.create = async (req, res) => {
    
    const find = {
        deleted:false,
       
    }

    // find tìm nhiều ->[], findOne ->obj
    
    const category = await ProductsCategory.find(find)
    const categorys = createTree.tree(category)
    
    
    res.render("admin/pages/products/create",{
        pageTitle: "Tạo sản phẩm mới",
        category:categorys

    })
}

module.exports.createPost = async (req, res) => {
    //console.log(req.file)
    

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if(req.body.position == ''){
        const countProduct = await Products.countDocuments()
        req.body.position = countProduct+1
    }else {
        req.body.position = parseInt(req.body.position)
    }
    // if(req.file){

    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }

    try {
        
        const product = new Products(req.body)
        await product.save()
        req.flash("success",`Tạo sản phẩm thành công`)

    } catch (error) {
        req.flash("error",`Tạo sản phẩm thất bại`)
    }
    
    
    res.redirect(`${systermConfig.prefixAdmin}/products`)
}
// create item end

// edit products
module.exports.edit =async  (req, res) => {
    
    
    try {
        const find = {
            deleted:false,
            _id : req.params.id
        }
    
        // find tìm nhiều ->[], findOne ->obj
        const product = await Products.findOne(find)
        const category = await ProductsCategory.find({deleted:false})
        const categorys = createTree.tree(category)
        
        res.render("admin/pages/products/edit",{
            pageTitle: "Chỉnh sửa sản phẩm",
            product:product,
            category: categorys
    
        })
        
    } catch (error) {
        res.redirect(`${systermConfig.prefixAdmin}/products`)
    }
}
// end edit products

module.exports.editPatch =async  (req, res) => {
    
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    req.body.position = parseInt(req.body.position)
    
    if(req.file){

        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    
    try {
        
        await Products.updateOne({_id:req.params.id},req.body)
        req.flash("success",`Cập nhật sản phẩm thành công`)
    } catch (error) {
        req.flash("error",`Cập nhật sản phẩm thất bại`)
    }
    res.redirect("back")
}

//detail

module.exports.detail =async  (req, res) => {
    
    try {
        
        const find = {
            deleted:false,
            _id : req.params.id
        }
    
        // find tìm nhiều ->[], findOne ->obj
        const product = await Products.findOne(find)
        //console.log(product)
        
        res.render("admin/pages/products/detail",{
            pageTitle: product.title,
            product:product
    
        })
    } catch (error) {
        res.redirect(`${systermConfig.prefixAdmin}/products`)
    }
    
}