const express = require("express")
const router = express.Router()
const controller = require("../../controller/admin/products-category.controller.js")
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const uploadCloud  = require("../../middlewares/admin/uploadCloud.middleware.js")

const multer = require("multer")

const validate = require("../../validates/admin/products-category.validate.js")

//Configuration
cloudinary.config({ 
    cloud_name: "dbrwioo7f", 
    api_key: "829754235996924", 
    api_secret: "lAaI-ubZoRRpOHHyP-SD1d47yVY" // Click 'View Credentials' below to copy your API secret
});


const upload = multer()




router.get('/',controller.index)
router.get('/create',controller.create)
router.post(
    '/create',
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.creatPost,
    controller.createPost
);



module.exports = router