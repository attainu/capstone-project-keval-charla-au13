import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import { userCart } from "../functions/user";

function Cart({ history }) {
    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const saveOrderToDb = () => {
        // console.log("cart",JSON.stringify(cart, null, 4));
        userCart(cart, user.token).then((res) => {
            // console.log("Cart post res", res);
            if (res.data.ok) history.push("/checkout")
        }).catch((err) => { });
    };

    const saveCashOrderToDb = () => {
        // console.log("cart",JSON.stringify(cart, null, 4));
        dispatch({
            type: "COD",
            payload: true
        });

        userCart(cart, user.token).then((res) => {
            // console.log("Cart post res", res);
            if (res.data.ok) history.push("/checkout")
        }).catch((err) => { });
    };

    const showCartItems = () => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>

            {cart.map(product => (
                <ProductCardInCheckout key={product._id} product={product} />
            ))}
        </table>
    )

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                    <h4>Cart / {cart.length} {cart.length > 1 ? "Products" : "Product"}</h4>

                    {!cart.length ? (
                        <p>No products in cart. <Link to="/shop">Continue Shopping.</Link></p>
                    ) : (
                        showCartItems()
                    )}
                </div>

                <div className="col-xl-4">
                    Order Summary
                    <hr />
                    <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={c._id}>
                            <p>{c.title} X {c.count} = &#x20B9;{c.price * c.count}</p>
                        </div>
                    ))}
                    <hr />
                    Total: <b>&#x20B9;{getTotal()}</b>
                    <hr />
                    {
                        user ? (
                            <>
                                <button
                                    onClick={saveOrderToDb}
                                    className="btn btn-sm btn-primary mt-2"
                                    disabled={!cart.length}
                                >
                                    Proceed to Checkout
                                </button>
                                <br />
                                <button
                                    onClick={saveCashOrderToDb}
                                    className="btn btn-sm btn-warning mt-2"
                                    disabled={!cart.length}
                                >
                                    Pay Cash on Delivery
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-sm btn-primary mt-2">
                                <Link
                                    to={{
                                        pathname: "/login",
                                        state: { from: "cart" }
                                    }}
                                    style={{ color: "inherit" }}
                                >
                                    Login to Checkout
                                </Link>
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Cart;
