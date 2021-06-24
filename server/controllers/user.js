const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const { nanoid } = require("nanoid");

exports.userCart = async (req, res) => {
    // console.log(req.body); // {cart: []}
    try {
        const { cart } = req.body;

        let products = [];

        const user = await User.findOne({ email: req.user.email }).exec();

        // check if cart with logged in user id already exist

        let cartExistByThisUser = await Cart.findOne({ orderdBy: user._id }).exec();

        if (cartExistByThisUser) {
            cartExistByThisUser.remove();
            console.log("removed old cart ");
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {};

            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            // get price  for creating total;
            let productFromDb = await Product.findById(cart[i]._id).select("price").exec();
            object.price = productFromDb.price;

            products.push(object);
        }
        // console.log("products",products);

        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }

        // console.log("cartTotal",cartTotal);

        let newCart = await new Cart({
            products,
            cartTotal,
            orderdBy: user._id
        }).save();

        // console.log("new Cart ===>", newCart);
        res.json({ ok: true });
    } catch (err) {
        res.sendStatus(400);
    }
};


exports.getUserCart = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();

        let cart = await Cart.findOne({ orderdBy: user._id })
            .populate("products.product", "_id title price totalAfterDiscount")
            .exec();

        const { products, cartTotal, totalAfterDiscount } = cart;
        res.json({ products, cartTotal, totalAfterDiscount });
    } catch (err) {
        res.sendStatus(400);
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();

        const cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec();
        res.json(cart);
    } catch (err) {
        res.sendStatus(400);
    }
};


exports.saveAddress = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.user.email }, { address: req.body.address }).exec();

        res.json({ ok: true });
    } catch (err) {
        res.sendStatus(400);
    }
};



exports.applyCouponToUserCart = async (req, res) => {
    try {
        const { coupon } = req.body;
        // console.log("COUPON", coupon);

        const validCoupon = await Coupon.findOne({ name: coupon }).exec();
        if (validCoupon === null) {
            return res.json({
                err: "Invalid coupon",
            });
        }
        // console.log("VALID COUPON", validCoupon);

        const user = await User.findOne({ email: req.user.email }).exec();

        let { products, cartTotal } = await Cart.findOne({ orderdBy: user._id })
            .populate("products.product", "_id title price").exec();

        // console.log("Cart total", cartTotal, "discount", validCoupon.discount);

        // total after discount

        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2); // 88.88

        Cart.findOneAndUpdate(
            { orderdBy: user._id },
            { totalAfterDiscount },
            { new: true }
        ).exec();

        res.json(totalAfterDiscount);
    } catch (err) {
        res.sendStatus(400);
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { paymentIntent } = req.body;
        const user = await User.findOne({ email: req.user.email }).exec();

        let { products } = await Cart.findOne({ orderdBy: user._id }).exec();

        let newOrder = await new Order({
            products,
            paymentIntent,
            orderdBy: user._id,
        }).save();

        let bulkOption = products.map(item => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                }
            };
        });

        let updated = await Product.bulkWrite(bulkOption, { new: true });

        // console.log("Product Quantity And Sold", updated);

        // console.log("New Order Saved", newOrder);
        res.json({ ok: true });
    } catch (err) {
        res.sendStatus(400);
    }
}

exports.orders = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.user.email }).exec();

        let userOrders = await Order.find({ orderdBy: user._id })
            .populate("products.product")
            .sort({ createdAt: -1 })
            .exec();

        res.json(userOrders);
    } catch (err) {
        res.sendStatus(400);
    }
}

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $addToSet: { wishlist: productId } }
        ).exec();

        res.json({ ok: true });
    } catch (err) {
        res.sendStatus(400);
    }
};

exports.wishlist = async (req, res) => {
    try {
        const list = await User.findOne({ email: req.user.email })
            .select("wishlist")
            .populate("wishlist")
            .exec();

        res.json(list);
    } catch (err) {
        res.sendStatus(400);
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $pull: { wishlist: productId } }
        ).exec();

        res.json({ ok: true });
    } catch (err) {
        res.sendStatus(400);
    }
};

exports.createCashOrder = async (req, res) => {
    try {
        const { COD, couponApplied } = req.body;

        if (!COD) return res.status(400).send("Create cash order failed");

        const user = await User.findOne({ email: req.user.email }).exec();

        let userCart = await Cart.findOne({ orderdBy: user._id }).exec();

        let finalAmount = 0;

        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = Math.round(userCart.totalAfterDiscount * 100);
        } else {
            finalAmount = Math.round(userCart.cartTotal * 100);
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: nanoid(),
                amount: finalAmount,
                currency: "INR",
                status: "Cash On Delivery",
                created: Date.now(),
                payment_method_types: ["cash"],
            },
            orderdBy: user._id,
            orderStatus: "Cash On Delivery"
        }).save();

        let bulkOption = userCart.products.map(item => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                }
            };
        });

        let updated = await Product.bulkWrite(bulkOption, { new: true });

        // console.log("Product Quantity And Sold", updated);

        // console.log("New Order Saved", newOrder);
        res.json({ ok: true });
    } catch (err) {
        res.sendStatus(400);
    }
}

