import React from 'react';

function ShowPaymentInfo({ order }) {
    return (
        <div>
            <p>
                <span><strong>Order Id: </strong>{order.paymentIntent && order.paymentIntent.id}</span><br />
                <span>
                    <strong>Amount: </strong>{order.paymentIntent && (order.paymentIntent.amount / 100).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                    })}
                </span>{" / "}
                <span><strong>Currency: </strong>{order.paymentIntent && order.paymentIntent.currency.toUpperCase()}</span>{" / "}
                <span><strong>Method: </strong>{order.paymentIntent && order.paymentIntent.payment_method_types[0]}</span>{" / "}
                <span><strong>Payment: </strong>{order.paymentIntent && order.paymentIntent.status.toUpperCase()}</span>{" / "}
                <span>
                    <strong>Ordered on:</strong>{" "}
                    {order.paymentIntent && new Date(order.paymentIntent.created * 1000).toLocaleString()}
                </span><br />
                <span className="badge bg-primary text-white">
                    STATUS: {order.orderStatus}
                </span>
            </p>
        </div>
    )
}

export default ShowPaymentInfo;
