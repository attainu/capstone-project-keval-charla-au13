const User = require("../models/user");
const Cart = require("../models/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    // console.log(req.body);
    try {
        const { id, couponApplied } = req.body;

        const user = await User.findOne({ email: req.user.email }).exec();

        const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderdBy: user._id }).exec();

        // console.log("CART CHARGE TOTAL", cartTotal, "AFTER DISCOUNT", totalAfterDiscount);

        let finalAmount = 0;

        if (couponApplied && totalAfterDiscount) {
            finalAmount = Math.round(totalAfterDiscount * 100);
        } else {
            finalAmount = Math.round(cartTotal * 100);
        }


        const payment = await stripe.paymentIntents.create({
            amount: finalAmount,
            currency: "INR",
            description: "Laptop",
            payment_method: id,
            confirm: true
        })
        console.log("Payment", payment)

        res.json({
            payment,
            cartTotal,
            totalAfterDiscount,
            payable: finalAmount
        })
    } catch (err) {
        // console.log("Error", err);
        res.json({
            message: "Payment failed",
            success: false
        })
    }
};

exports.displayPaymentInfo = async (req, res) => {
    try {
        const { couponApplied } = req.body;

        const user = await User.findOne({ email: req.user.email }).exec();

        const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderdBy: user._id }).exec();

        // console.log("CART CHARGE TOTAL", cartTotal, "AFTER DISCOUNT", totalAfterDiscount);

        let finalAmount = 0;

        if (couponApplied && totalAfterDiscount) {
            finalAmount = Math.round(totalAfterDiscount * 100);
        } else {
            finalAmount = Math.round(cartTotal * 100);
        }

        res.json({
            cartTotal,
            totalAfterDiscount,
            payable: finalAmount
        })
    } catch (err) {
        res.sendStatus(400);
    }
}
