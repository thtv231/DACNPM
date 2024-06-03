const mongoose = require("mongoose")
module.exports.connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connect OK!")
        
    } catch (error) {
        console.log("connect error!")
    }
}
