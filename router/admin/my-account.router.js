const express = require("express")
const router = express.Router()
const controller = require("../../controller/admin/my-account.controller.js")
const multer = require("multer")
const uploadCloud  = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require("../../validates/admin/accounts.validate.js")


const upload = multer()
router.get('/',controller.index )
router.get('/edit',controller.edit )
router.patch('/edit',upload.single("avatar"),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch 
)



module.exports = router