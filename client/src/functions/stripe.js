import axios from "axios";

export const createPaymentIntent = async (authtoken, id, coupon) =>
    await axios.post(`${process.env.REACT_APP_API}/create-payment-intent`,
        {
            id,
            couponApplied: coupon
        },
        {
            headers: {
                authtoken,
            },
        })


export const displayPaymentInfo = async (authtoken, coupon) =>
    await axios.post(`${process.env.REACT_APP_API}/display-payment-info`,
        {
            couponApplied: coupon
        },
        {
            headers: {
                authtoken
            }
        })
