const Account = require("../../model/acounts.model")
const Role = require("../../model/roles.model")
const systermConfig = require("../../config/systerm")
module.exports.requireAuth = async (req,res,next)=>{
    if(!req.cookies.token){
        res.redirect(`${systermConfig.prefixAdmin}/auth/login`)
    }else{
        const user = await Account.findOne({token:req.cookies.token}).select("-password")
        if(!user){
            res.redirect(`${systermConfig.prefixAdmin}/auth/login`)

        }else{
            const role = await Role.findOne({
                
                _id:user.role_id
            }).select("title permissions")
            res.locals.user = user
            res.locals.role = role

            next()
        }
    }
}