const dashboardRouter = require("./dashboard.router.js")
const prodcutsRouter = require("./products.router.js")
const systermConfig = require("../../config/systerm.js")
module.exports = (app)=>{
    const PATH_ADMIN = systermConfig.prefixAdmin
    
    app.use(PATH_ADMIN+"/dashboard", dashboardRouter)
    
    app.use(PATH_ADMIN+"/products",prodcutsRouter)
}