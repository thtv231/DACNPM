const Cart = require("../../model/cart.model")


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