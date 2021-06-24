import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";


const Orders = ({ orders, handleStatusChange }) => {

    const showOrderInTable = (order) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                </tr>
            </thead>

            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i}>
                        <td>
                            <b>{p.product.title}</b>
                        </td>
                        <td>{p.product.price}</td>
                        <td>{p.product.brand}</td>
                        <td>{p.color}</td>
                        <td>{p.count}</td>
                        <td>
                            {p.product.shipping === "Yes" ? (
                                <CheckCircleOutlined style={{ color: "green" }} />
                            ) : (
                                <CloseCircleOutlined style={{ color: "red" }} />
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            {orders.map((order) => (
                <div
                    key={order._id}
                    className="row m-5 p-3 card"
                    style={{ width: "93%" }}
                >
                    <ShowPaymentInfo order={order} />

                    <div className="row">
                        <div className="col-md-2">
                            Delivery Status
                        </div>
                        <div className="col-md-3 mb-4">
                            <select
                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                className="form-control"
                                defaultValue={order.orderStatus}
                                name="status"
                            >
                                <option value="Not Processed">Not Processed</option>
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Processing">Processing</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {showOrderInTable(order)}
                </div>
            ))}
        </>
    )
};

export default Orders;