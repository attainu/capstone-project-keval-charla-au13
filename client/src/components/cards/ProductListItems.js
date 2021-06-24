import React from 'react';
import { Link } from "react-router-dom";

function ProductListItems({ product }) {
    return (
        <div className="table-responsive">
            <table className="table table-sm table-borderless mb-0">
                <tbody>
                    <tr>
                        <th className="pl-0 w-100" scope="row">
                            <strong>Price</strong>
                        </th>
                        <td>&#x20B9;{product && product.price}</td>
                    </tr>
                    {product && product.category && (
                        <tr>
                            <th className="pl-0 w-100" scope="row">
                                <strong>Category</strong>
                            </th>
                            <td><Link to={`/category/${product.category.slug}`}>{product.category.name}</Link></td>
                        </tr>
                    )}
                    <tr>
                        <th className="pl-0 w-100" scope="row">
                            <strong>Shipping</strong>
                        </th>
                        <td>{product && product.shipping}</td>
                    </tr>
                    <tr>
                        <th className="pl-0 w-100" scope="row">
                            <strong>Color</strong>
                        </th>
                        <td>{product && product.color}</td>
                    </tr>
                    <tr>
                        <th className="pl-0 w-100" scope="row">
                            <strong>Brand</strong>
                        </th>
                        <td>{product && product.brand}</td>
                    </tr>
                    <tr>
                        <th className="pl-0 w-100" scope="row">
                            <strong>Available</strong>
                        </th>
                        <td>{product && product.quantity}</td>
                    </tr>
                    <tr>
                        <th className="pl-0 w-100" scope="row">
                            <strong>Sold</strong>
                        </th>
                        <td>{product && product.sold}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ProductListItems;
