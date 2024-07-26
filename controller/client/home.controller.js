const Products = require("../../model/products.model")


module.exports.index = async (req, res) => {
    
   
    
    const find = {
        deleted: false,
        status: "active",
        featured:"1"
    };

   
    const products = await Products.find(find).limit(6)
   
    products.forEach(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
    })
    //console.log(products)

    const productsNew = await Products.find({
        deleted: false,
        status: "active",
    }).sort({position:"desc"}).limit(6)

    res.json({
        products: products,
        productsNew:productsNew
    })
}

