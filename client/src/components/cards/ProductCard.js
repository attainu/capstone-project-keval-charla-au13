import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import laptop from "../../images/laptop.jpg";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useDispatch } from "react-redux";

const { Meta } = Card;

function ProductCard({ product }) {
  const [tooltip, setTooltip] = useState('Click to add');

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in localstorage GET it.
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual)
      // save to local storage
      // console.log("unique",unique);
      localStorage.setItem("cart", JSON.stringify(unique));
      // show tooltip
      setTooltip("Added")

      // Add to redux store
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      })

      // Show cart item in cart drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      })
    }
  }


  const { images, title, description, slug, price } = product;

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : laptop}
            style={{ height: "300px", objectFit: "cover" }}
            className="p-3"
            alt={title}
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart} disabled={product.quantity < 1}>
              <ShoppingCartOutlined className="text-danger" /> <br />
              {product.quantity < 1 ? "Out of stock" : "Add to cart"}
            </a>
          </Tooltip>,
        ]}
        style={{ width: 300 }}
      >
        <Meta
          title={`${title} - \u20B9${price}`}
          description={`${description && description.substring(0, 34)}`}
        />
      </Card>
    </>
  );
}

export default ProductCard;
