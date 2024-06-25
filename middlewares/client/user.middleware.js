const User = require("../../model/users.model")

module.exports.userInfo =async (req,res,next)=>{
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted:false
        }).select("-password")

        if(user){
            res.locals.user = user
            //console.log(user)
        }
    }

    next()
}