const express = require("express")
const router = express.Router()
const controller = require("../../controller/admin/products-category.controller.js")


const multer = require("multer")

const validate = require("../../validates/admin/products-category.validate.js")
const uploadCloud  = require("../../middlewares/admin/uploadCloud.middleware.js")

//Configuration



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