const Cart = require("../../model/cart.model")
const Product = require("../../model/products.model")
const productHelper = require("../../helpers/products")
const Order = require("../../model/orders.model")



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

module.exports.order =async (req,res)=>{
    const cartId = req.cookies.cartId
    const userInfo = req.body
    const cart= await Cart.findOne({
        _id: cartId
    })

    let products = []

    for (const product of cart.products) {
        let objProduct={
            product_id: product.product_id,
            price: 0,
            discountPercentage : 0,
            quantity: product.quantity
        }

        const productInfo = await Product.findOne({
            _id: product.product_id
        })
        objProduct.price = productInfo.price
        objProduct.discountPercentage = productInfo.discountPercentage

        products.push(objProduct)
       

    }

    const objOrder = {
        cart_id: cartId,
        userInfo :userInfo,
        products :products
    }

    if(res.locals.user){
        objOrder.user_id = res.locals.user.tokenUser
    }

    await Cart.updateOne({
        _id: cartId
    },{products: []})
    
    const order = new Order(objOrder)
    await order.save()

    res.redirect(`/checkout/success/${order.id}`)
}

module.exports.success =async (req,res)=>{
    const orderId = req.params.id
    
    
    const order= await Order.findOne({
        _id: orderId
    })
    //console.log(order)
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")

        product.productInfo = productInfo
        product.priceNew = productHelper.priceNewProduct(product)
        product.totalPrice = product.priceNew*product.quantity


    }

    order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)
    //console.log(order)

    res.render("client/pages/checkout/success",{
        order:order
    })
}