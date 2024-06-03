const homeRouter = require("./home.router.js")
const prodcutsRouter = require("./products.router.js")
module.exports = (app)=>{
    app.use('/', homeRouter)
    
    app.use('/products',prodcutsRouter)
}