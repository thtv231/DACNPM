const Products = require("../../model/products.model")
const { prodcuts } = require("./products.controller")


module.exports.index = async (req, res) => {
    
   const keyword = req.query.keyword
   let newProducts = []
   if(keyword){
        const keywordRegex = new RegExp(keyword,"i")
        const products = await Products.find({
            title:keywordRegex,


            status:"active",
            deleted:false
        })
        products.forEach(item => {
             item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
        })
        newProducts = products

        
   }
   
    // res.render("client/pages/search/index",
    //     {
    //         pageTitle: "Kết quả tìm kiếm",
    //         keyword:keyword,
    //         products:newProducts

           
    //     }
    // )
    res.json({
        pageTitle: "Kết quả tìm kiếm",
        keyword:keyword,
        products:newProducts
    })
}