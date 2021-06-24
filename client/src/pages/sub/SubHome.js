import React, { useState, useEffect } from 'react';
import { getSub } from "../../functions/sub";
import ProductCard from '../../components/cards/ProductCard';

function SubHome({ match }) {
    const [sub, setSub] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = match.params;

    useEffect(() => {
        setLoading(true);
        getSub(slug).then(res => {
            // console.log(JSON.stringify(res.data, null, 4));
            setSub(res.data.sub);
            setProducts(res.data.products);
            setLoading(false);
        }).catch(err => { })
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    {loading ? (
                        <h4 className="text-center p-3 mt-5 mb-5 display-4 product-headers">
                            Loading...
                        </h4>
                    ) : (
                        <h4 className="text-center p-3 mt-5 mb-5 display-4 product-headers">
                            {products.length} Products in "{sub.name}" sub category
                        </h4>
                    )}
                </div>
            </div>

            <div className="row">
                {products.map(product => (
                    <div className="col-md-3" key={product._id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubHome;
