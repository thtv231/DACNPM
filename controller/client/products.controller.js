
const Products = require("../../model/products.model")
const ProductsCategory = require("../../model/products-category.model");

const productCategory = require("../../helpers/products-category")
module.exports.prodcuts = async (req, res) => {
    
    const filterStatus = [
        // Các giá trị của filterStatus nên được định nghĩa ở đây
        { name:"Mới nhất",status: 'newest', class: '' },
        { name:"Giá tăng dần",status: 'ascending', class: '' },
        { name:"Giá giảm dần",status: 'descending', class: '' },
    ];
    
    const find = {
        deleted: false,
        status: "active"
    };

    if(req.query.keyword){
        const keyword = req.query.keyword
        const regex = RegExp(keyword,'i')
        find.title = regex
        
    }
    const products = await Products.find(find)
    if (req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        
        if (index !== -1) {
            filterStatus[index].class = "active";
            
            if (req.query.status == "ascending") {
                products.sort((a, b) => a.price - b.price);
            } else if (req.query.status == "descending") {
                products.sort((a, b) => b.price - a.price);
            } else if (req.query.status == "newest") {
                products.sort((a, b) => b.position - a.position);
            }
        }
    } else {
        filterStatus[0].class = "active";
        products.sort((a, b) => b.position - a.position);
    }





    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
    })
    //console.log(prodcuts)





    res.render("client/pages/products/index",
        {
            products: products,
            filterStatus: filterStatus
        }
    )
}

module.exports.detail =async (req,res)=>{
    try {
        const find = {
            deleted: false,
            slug : req.params.slugProduct,
            status:"active"
        }
        
        
        const product = await Products.findOne(find)
        //console.log(product)
        if(product.products_category_id){
            const category = await ProductsCategory.findOne({
                _id:product.products_category_id,
                status:"active",
                deleted:false
            })
            product.category=category
        }
        
        product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)
                
        res.render("client/pages/products/detail",{
            
            product:product
            
        }
            
        )
        
    } catch (error) {

        res.redirect("back")
    }
    
}

module.exports.category = async (req,res)=>{
    const category = await ProductsCategory.findOne({
        slug: req.params.slugCategory,
        deleted:false

    })



    const listCategory = await productCategory.getSubCategory(category.id)

    const listCategoryId = listCategory.map(item => item.id)
    const products = await Products.find({
        products_category_id: {$in:[category.id,...listCategoryId]},
        deleted:false
    }).sort({position:"desc"})

    //console.log(products)

    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
    })
    res.render("client/pages/products/index",
        {
            pageTitle: "Danh sách sản phẩm",
            products: products
            
           
        }
    )
}