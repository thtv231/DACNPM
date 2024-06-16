const express = require("express")
const router = express.Router()
const controller = require("../../controller/admin/account.controller")
const multer = require("multer")
const uploadCloud  = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require("../../validates/admin/accounts.validate.js")


const upload = multer()


router.get('/',controller.index )
router.get('/create',controller.create )
router.post('/create',
    upload.single("avatar"),
    uploadCloud.upload,
    validate.creatPost,
    controller.createPost
)

router.get('/edit/:id',controller.edit )

router.patch('/edit/:id',
    upload.single("avatar"),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch
)



module.exports = router