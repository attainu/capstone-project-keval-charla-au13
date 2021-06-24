import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import SingleProduct from "../components/cards/SingleProduct";
import { getProduct, productStar } from "../functions/product";
import { useSelector } from "react-redux";
import { getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";
const { TabPane } = Tabs;

function Product({ match }) {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);
  // redux
  const { user } = useSelector((state) => ({ ...state }));
  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user's star
    }
  });

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      // load   related
      getRelated(res.data._id)
        .then((res) => setRelated(res.data))
        .catch(err => { });
    });
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    // console.table(newRating, name);
    productStar(name, newRating, user.token).then((res) => {
      // console.log("rating clicked", res.data);
      loadSingleProduct();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>

      <div className="row">
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {product && product.description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on xxxx xxx xxx to know more about this product.
          </TabPane>
        </Tabs>
      </div>

      <div className="row">
        <div className="col text-center pt-5">
          <hr />
          Related Products
          <hr />
        </div>
      </div>
      <div className="row p-5">
        {related.length
          ? related.map((r) => (
            <div key={r._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
              <ProductCard product={r} />
            </div>
          ))
          : (
            <div className="text-center  col"> No Products Found</div>
          )
        }
      </div >
    </div >
  );
}

export default Product;
