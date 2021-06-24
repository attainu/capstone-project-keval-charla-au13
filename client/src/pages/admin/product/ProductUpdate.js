import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../../functions/product";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from '@ant-design/icons';
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue", "Green", "Red", "Purple", "Pink", "Yellow", "Grey"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "Dell", "Acer", "HP", "MSI", "Nokia", "Xiaomi", "Realme", "Oppo", "Vivo", "Motorola", "Google", "OnePlus", "SanDisk", "Boat", "JBL", "Canon", "Sony", "Infinix"],
    color: "",
    brand: "",
};

function ProductUpdate({ match, history }) {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));
    const { slug } = match.params;

    useEffect(() => {
        loadCategories();
        loadProduct();
    }, [])

    const loadProduct = () => {
        getProduct(slug)
            .then(p => {
                setValues({ ...values, ...p.data });

                getCategorySubs(p.data.category._id).then(res => {
                    setSubOptions(res.data);
                })

                let arr = [];

                p.data.subs.map(s => {
                    arr.push(s._id);
                });

                // console.log("ARR", arr);
                setArrayOfSubs(prev => arr);
            })
            .catch(err => { })
    }

    const loadCategories = () =>
        getCategories().then((c) => setCategories(c.data)).catch(err => { });

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        values.subs = arrayOfSubs;
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
            .then(res => {
                setLoading(false);
                toast.success(`${res.data.title} is updated`);
                history.push("/admin/products");
            })
            .catch(err => {
                // console.log(err);
                setLoading(false);
                toast.error(err.response.data.err);
            })
    }

    const handleChange = (e) => {
        // setValues({
        //     ...values,
        //     [e.target.name]: e.target.value
        // });

        setValues(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const handleCategoryChange = (e) => {
        e.preventDefault()
        // console.log("CLICKED CATEGORY", e.target.value);
        setValues({ ...values, subs: [] });

        setSelectedCategory(e.target.value);

        getCategorySubs(e.target.value)
            .then((res) => {
                // console.log("sub options category clicked", res);
                setSubOptions(res.data);
            })
            .catch(err => { });

        // default category items
        if (values.category._id === e.target.value) {
            loadProduct();
        }

        setArrayOfSubs([]);
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
                        <h4>Products update</h4>
                    )}

                    {/* {JSON.stringify(values)} */}

                    <div className="p-3">
                        <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
                    </div>

                    <br />

                    <ProductUpdateForm
                        values={values}
                        setValues={setValues}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        categories={categories}
                        subOptions={subOptions}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubs={setArrayOfSubs}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductUpdate;
