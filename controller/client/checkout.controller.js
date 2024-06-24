const Cart = require("../../model/cart.model")
const Product = require("../../model/products.model")
const productHelper = require("../../helpers/products")



module.exports.index =async (req,res)=>{
    const cartId = req.cookies.cartId
    const cart= await Cart.findOne({
        _id: cartId
    })

    if(cart.products.length >0){
        let total =0
        for(const item of cart.products){
            const productId = item.product_id
            const productInfo = await Product.findOne({
                _id:productId
            })

            productInfo.priceNew = productHelper.priceNewProduct(productInfo)
            item.productInfo = productInfo
            total+=parseInt(productInfo.priceNew)*parseInt(item.quantity)
        }
        cart.totalPrice = total
        
    }


    //console.log(cart)
    res.render("client/pages/checkout/index",
        {
            pageTitle: "Đặt hàng",
            cartDetail : cart
           
        }
    )
}