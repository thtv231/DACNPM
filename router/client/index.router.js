const homeRouter = require("./home.router.js")
const prodcutsRouter = require("./products.router.js")
const categoryMiddleWare =require("../../middlewares/client/category.middleware.js")
const searchRouter = require("./search.router.js")
const cartRouter = require("./cart.router.js")
const checkoutRouter = require("./checkout.router.js")
const userRouter = require("./user.router.js")
const cartMiddleWare =require("../../middlewares/client/cart.middleware.js")

module.exports = (app)=>{
    app.use(categoryMiddleWare.categoryMiddleWare)
    app.use(cartMiddleWare.cartId)
    app.use('/', homeRouter)
    app.use('/cart', cartRouter)
    app.use('/checkout', checkoutRouter)
    
    app.use('/products',prodcutsRouter)
    app.use('/search',searchRouter)
    app.use('/user',userRouter)

}