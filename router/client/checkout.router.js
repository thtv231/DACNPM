const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/checkout.controller");

router.get("/", controller.index);
router.post("/order", controller.order);
router.get("/success/:id", controller.success);
router.patch("/update/:id", controller.update);
router.post("/create_payment_url", controller.createPaymentUrl);
router.get("/vnpay_ipn", controller.VNPAY_IPN);
router.get("/transaction/:id", controller.transaction);

module.exports = router;
