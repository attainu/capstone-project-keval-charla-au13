const Order = require("../models/order");

exports.orders = async (req, res) => {
    try {
        let allOrders = await Order.find({})
            .sort("-createdAt")
            .populate("products.product")
            .exec();

        res.json(allOrders);
    } catch (err) {
        res.sendStatus(400);
    }
};


exports.orderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        let updated = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        ).exec();

        res.json(updated);
    } catch (err) {
        res.sendStatus(400);
    }
};