const express = require("express")
const router = express.Router()
const controller = require("../../controller/client/products.controller.js")

router.get('/',controller.prodcuts )
router.get('/detail/:slugProduct',controller.detail)
router.get('/:slugCategory',controller.category )

module.exports = router