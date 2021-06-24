import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent, displayPaymentInfo } from "../functions/stripe";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { createOrder, emptyUserCart } from "../functions/user";

function StripeCheckout({ history }) {
    const dispatch = useDispatch();
    const { user, coupon } = useSelector(state => ({ ...state }));

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState("");
    const [disabled, setDisabled] = useState(true);

    const [cartTotal, setCartTotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [payable, setPayable] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        displayPaymentInfo(user.token, coupon).then((res) => {
            // console.log(res.data);
            setCartTotal(res.data.cartTotal);
            setTotalAfterDiscount(res.data.totalAfterDiscount);
            setPayable(res.data.payable);
        }).catch(err => { })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const cardElement = elements.getElement(CardElement);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                setError(`Payment failed ${error.message}`);
                setProcessing(false);
            } else {
                const { id } = paymentMethod;

                const response = await createPaymentIntent(user.token, id, coupon);

                // console.log(response.data.payment);

                if (response.data.payment.status === "succeeded") {
                    // console.log("Successful Payment");
                    createOrder(response.data.payment, user.token).then(res => {
                        if (res.data.ok) {
                            if (typeof window !== "undefined") localStorage.removeItem("cart");

                            dispatch({
                                type: "ADD_TO_CART",
                                payload: [],
                            });

                            dispatch({
                                type: "COUPON_APPLIED",
                                payload: false,
                            });

                            emptyUserCart(user.token);
                        }
                    }).catch(err => { });

                    setSucceeded(true);
                    setError(null);
                    setProcessing(false);
                }
            }
        } catch (err) { }
    };

    const handleChange = async (e) => {
        // listen for changes in the card element
        // and display any errors as the customer types their card details
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    };

    const cartStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    return (
        <>
            {
                !succeeded && (<div>
                    {coupon && totalAfterDiscount !== undefined ? (
                        <p className="alert alert-success">{`Total after discount: \u20B9${totalAfterDiscount}`}</p>
                    ) : (
                        <p className="alert alert-danger">No coupon applied</p>
                    )}
                </div>
                )}
            <div className="text-center pb-5">
                <Card
                    title="Summary"
                    bordered={false}
                    actions={[
                        <>
                            Total: &#x20B9;{cartTotal}
                        </>,
                        <>
                            Total Payable: &#x20B9;{(payable / 100).toFixed(2)}
                        </>
                    ]}
                />
            </div>

            <form
                id="payment-form"
                className="stripe-form"
                onSubmit={handleSubmit}
            >
                <CardElement
                    id="card-element"
                    options={cartStyle}
                    onChange={handleChange}
                />
                <button
                    className="stripe-button"
                    disabled={processing || disabled || succeeded}
                >
                    <span id="button-text">
                        {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
                    </span>
                </button>
                <br />
                {error && <div className="card-error" role="alert">{error}</div>}
                <br />
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Payment Successful.{" "}
                    {user.role === "admin" ? (
                        <Link to="/admin/dashboard">See it in your Dashboard.</Link>
                    ) : (
                        <Link to="/user/history">See it in your purchase history.</Link>
                    )}
                </p>
            </form>
        </>
    )
}

export default StripeCheckout;
