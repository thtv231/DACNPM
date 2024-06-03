const express = require("express")
const router = express.Router()
const controller = require("../../controller/client/products.controller.js")

router.get('/',controller.prodcuts )
router.get('/:slug',controller.detail)

module.exports = router