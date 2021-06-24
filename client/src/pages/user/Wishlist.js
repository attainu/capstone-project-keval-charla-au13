import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../functions/user";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = () => {
        getWishlist(user.token).then(res => {
            // console.log(res);
            setWishlist(res.data.wishlist);
        }).catch(err => { })
    }

    const handleRemove = productId => (
        removeWishlist(productId, user.token).then(res => {
            loadWishlist();
        }).catch(err => { })
    )

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    <h4>Wishlist</h4>

                    {wishlist.map(p => (
                        <div
                            key={p._id}
                            className="alert alert-secondary"
                            style={{ width: "95%" }}
                        >
                            <Link to={`/product/${p.slug}`}>{p.title}</Link>
                            <span
                                onClick={() => handleRemove(p._id)}
                                className="float-end"
                                style={{ cursor: "pointer" }}
                            >
                                <DeleteOutlined className="text-danger" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default Wishlist;