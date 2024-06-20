const homeRouter = require("./home.router.js")
const prodcutsRouter = require("./products.router.js")
const categoryMiddleWare =require("../../middlewares/client/category.middleware.js")
module.exports = (app)=>{
    app.use(categoryMiddleWare.categoryMiddleWare)
    app.use('/', homeRouter)
    
    app.use('/products',prodcutsRouter)
}