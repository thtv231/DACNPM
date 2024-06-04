const express = require("express")
const router = express.Router()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const uploadCloud  = require("../../middlewares/admin/uploadCloud.middleware.js")
const storageMulter = require("../../helpers/stoageMulter.js")
const multer = require("multer")
const controller = require("../../controller/admin/products.controller.js")
const validate = require("../../validates/admin/products.validate.js")


// Configuration
cloudinary.config({ 
    cloud_name: "dbrwioo7f", 
    api_key: "829754235996924", 
    api_secret: "lAaI-ubZoRRpOHHyP-SD1d47yVY" // Click 'View Credentials' below to copy your API secret
});
const upload = multer()

router.get('/',controller.prodcuts )
router.patch('/change-status/:status/:id',controller.changeStatus )
router.patch('/change-multi',controller.changeMultiStatus )
router.delete('/delete/:id',controller.deleteItem )
router.get('/create',controller.create )
const MAX_RETRIES = 3;

router.post(
  '/create',
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.creatPost,
  controller.createPost
);

router.get('/edit/:id',controller.edit )
router.patch(
    '/edit/:id',
    upload.single("thumbnail"),
  uploadCloud.upload,

    validate.creatPost,
    controller.editPatch
)

router.get('/detail/:id',controller.detail )


module.exports = router