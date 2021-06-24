const express = require("express");
const router = express.Router();

const { createPaymentIntent, displayPaymentInfo } = require("../controllers/stripe");

const { authCheck } = require("../middlewares/auth");

router.post("/create-payment-intent", authCheck, createPaymentIntent);
router.post("/display-payment-info", authCheck, displayPaymentInfo);

module.exports = router;
