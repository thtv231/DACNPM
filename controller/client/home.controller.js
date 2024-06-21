const Products = require("../../model/products.model")

module.exports.index = async (req, res) => {
    
   
    
    const find = {
        deleted: false,
        status: "active",
        featured:"1"
    };

   
    const products = await Products.find(find)
   
    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
    })
    //console.log(products)
    res.render("client/pages/home/index",
        {
            products: products,
           
        }
    )
}