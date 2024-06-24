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
    res.render("client/pages/cart/index",
        {
            pageTitle: "Giỏ Hàng",
            cartDetail : cart
           
        }
    )
}

module.exports.addPost =async (req,res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await  Cart.findOne({
        _id: cartId
    })

    const existProductInCart = cart.products.find(item => item.product_id == productId)
    if(existProductInCart){
        const newQuantity = quantity + existProductInCart.quantity
        await Cart.updateOne(
            {
                _id:cartId,
                'products.product_id' :productId
            },
            {
                'products.$.quantity': newQuantity
            }
    )
    }else {
        const objCart = {
            product_id : productId,
            quantity : quantity
        }
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: {products:objCart}
            }
    )
    }
    req.flash("success","Đã thêm vao giỏ hàng !")
    
    res.redirect("back")

}

module.exports.delete =async (req,res)=>{
    const productId = req.params.productId
    const cartId = req.cookies.cartId

    await Cart.updateOne(
        {
        _id: cartId
    },
    {
        "$pull":{products:{"product_id":productId}}
    }
)
    
    req.flash("success", "Xóa thành công")
    res.redirect("back")
}
