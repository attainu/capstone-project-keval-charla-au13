import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from '@ant-design/icons';

const initialState = {
  title: "Macbook Pro",
  description: "This is best apple product",
  price: "45000",
  categories: [],
  category: "",
  subs: [],
  shipping: "Yes",
  quantity: "50",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue", "Green", "Red", "Purple", "Pink", "Yellow", "Grey"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "Dell", "Acer", "HP", "MSI", "Nokia", "Xiaomi", "Realme", "Oppo", "Vivo", "Motorola", "Google", "OnePlus", "SanDisk", "Boat", "JBL", "Canon", "Sony", "Infinix"],
  color: "White",
  brand: "Apple",
};

function ProductCreate() {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data })).catch(err => { });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        // console.log(res);
        window.alert(`"${res.data.title}" is created`);
        window.location.reload();
      })
      .catch((err) => {
        // if (err.response.status === 400) toast.error(err.response.data);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault()
    // console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });

    getCategorySubs(e.target.value)
      .then((res) => {
        // console.log("sub options category clicked", res);
        setSubOptions(res.data);
      }).catch(err => { });

    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h2" />
          ) : (
            <h4>Products create</h4>
          )}

          <hr />

          {/* {JSON.stringify(values.images)} */}


          <div className="p-3">
            <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
          </div>

          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCreate;
