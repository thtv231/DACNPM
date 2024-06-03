const express = require("express")
const router = express.Router()
const storageMulter = require("../../helpers/stoageMulter.js")
const multer = require("multer")
const upload = multer({storage:storageMulter()})
const controller = require("../../controller/admin/products.controller.js")
const validate = require("../../validates/admin/products.validate.js")
router.get('/',controller.prodcuts )
router.patch('/change-status/:status/:id',controller.changeStatus )
router.patch('/change-multi',controller.changeMultiStatus )
router.delete('/delete/:id',controller.deleteItem )
router.get('/create',controller.create )
router.post(
    '/create',
    upload.single("thumbnail"),
    validate.creatPost,
    controller.createPost 

)

router.get('/edit/:id',controller.edit )
router.patch(
    '/edit/:id',
    upload.single("thumbnail"),
    validate.creatPost,
    controller.editPatch
)

router.get('/detail/:id',controller.detail )


module.exports = router