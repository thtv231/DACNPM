const dashboardRouter = require("./dashboard.router.js")
const prodcutsRouter = require("./products.router.js")
const systermConfig = require("../../config/systerm.js")
const productCategory = require("./products-category.router.js")
const roleRouter = require("./role.admin.router.js")
module.exports = (app)=>{
    const PATH_ADMIN = systermConfig.prefixAdmin
    
    app.use(PATH_ADMIN+"/dashboard", dashboardRouter)
    
    app.use(PATH_ADMIN+"/products",prodcutsRouter)
    app.use(PATH_ADMIN+"/products-category",productCategory)
    app.use(PATH_ADMIN+"/roles", roleRouter)

}