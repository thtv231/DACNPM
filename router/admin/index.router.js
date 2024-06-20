const dashboardRouter = require("./dashboard.router.js")
const prodcutsRouter = require("./products.router.js")
const systermConfig = require("../../config/systerm.js")
const productCategory = require("./products-category.router.js")
const roleRouter = require("./role.admin.router.js")
const accountRouter = require("./account.router.js")
const authRouter = require("./auth.router.js")
const myaccountRouter = require("./my-account.router.js")
const authMiddleWare = require("../../middlewares/admin/auth.middleware.js")
module.exports = (app)=>{
    const PATH_ADMIN = systermConfig.prefixAdmin
    
    app.use(PATH_ADMIN+"/dashboard", 
        authMiddleWare.requireAuth,
        dashboardRouter
    )
    
    app.use(PATH_ADMIN+"/products",authMiddleWare.requireAuth,prodcutsRouter)
    app.use(PATH_ADMIN+"/products-category",authMiddleWare.requireAuth,productCategory)
    app.use(PATH_ADMIN+"/roles", authMiddleWare.requireAuth,roleRouter)
    app.use(PATH_ADMIN+"/accounts", authMiddleWare.requireAuth,accountRouter)
    app.use(PATH_ADMIN+"/my-account",authMiddleWare.requireAuth, myaccountRouter)
    app.use(PATH_ADMIN+"/auth", authRouter)

}