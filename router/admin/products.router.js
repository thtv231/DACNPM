const express = require("express")
const router = express.Router()


//const storageMulter = require("../../helpers/stoageMulter.js")
const multer = require("multer")
const controller = require("../../controller/admin/products.controller.js")
const validate = require("../../validates/admin/products.validate.js")
const uploadCloud  = require("../../middlewares/admin/uploadCloud.middleware.js")



const upload = multer()

router.get('/',controller.prodcuts )
router.patch('/change-status/:status/:id',controller.changeStatus )
router.patch('/change-multi',controller.changeMultiStatus )
router.delete('/delete/:id',controller.deleteItem )
router.get('/create',controller.create )


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