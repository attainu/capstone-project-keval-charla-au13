import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Laptop from "../../images/laptop.jpg";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";

// This is children components of Product page
function SingleProduct({ product, onStarClick, star }) {
  const [tooltip, setTooltip] = useState('Click to add');

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const history = useHistory();

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

      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      })

      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      })
    }
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then(res => {
      // console.log("ADDED TO WISHLIST", res.data);
      toast.success("Added to wishlist");
      history.push("/user/wishlist");
    }).catch(err => { })
  }

  return (
    <>
      <div className="col-lg-7">
        {product && product.images && product.images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {product.images &&
              product.images.map((i) => (
                <img src={i.url} key={i.public_id} alt={product.title} />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img src={Laptop} className="mb-3 card-image" alt={product && product.title} />}
          ></Card>
        )}
      </div>

      <div className="col-lg-5">
        <h1 className="bg-info p-3">{product && product.title}</h1>

        {product && product.ratings && product.ratings.length > 0
          ? showAverage(product)
          : <div className="text-center pt-1 pb-3">No rating yet</div>
        }

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-success" /> <br /> Add to cart
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={product && product._id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red  "
              />
            </RatingModal>
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
}

export default SingleProduct;
