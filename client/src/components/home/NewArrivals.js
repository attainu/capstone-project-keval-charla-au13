import React, { useEffect, useState } from 'react';
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCard from '../cards/ProductCard';
import LoadingCard from '../cards/LoadingCard';
import { Pagination } from "antd";

function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAllProducts();
    }, [page])

    useEffect(() => {
        getProductsCount()
            .then(res => setProductsCount(res.data))
            .catch(err => { });
    }, [])

    const loadAllProducts = () => {
        setLoading(true);
        getProducts("createdAt", "desc", page).then(res => {
            setProducts(res.data);
            setLoading(false);
        }).catch(err => { });
    };

    return (
        <>
            <div className="container mt-5">
                {loading ? (
                    <LoadingCard count={4} />
                ) : (
                    <div className="row">
                        {products.map(product => (
                            <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="row">
                <nav className="col-xl-3 col-lg-4 col-md-6 col-sm-8 offset-md-4 text-center pt-5 p-3">
                    <Pagination
                        current={page}
                        total={(productsCount / 3) * 10}
                        onChange={value => setPage(value)}
                    />
                </nav>
            </div>
        </>
    )
}

export default NewArrivals;
