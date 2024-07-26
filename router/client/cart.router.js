const express = require("express")
const router = express.Router()
const controller = require("../../controller/client/cart.controller.js")

router.get("/",controller.index)
router.delete("/delete/:productId",controller.delete)
router.patch("/update/:productId/:quantity",controller.update)
router.post('/add/:productId',controller.addPost )


module.exports = router