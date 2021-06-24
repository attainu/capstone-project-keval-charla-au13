import React from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import CategoryList from '../components/category/CategoryList';
import SubList from '../components/sub/SubList';

function Home() {
    return (
        <div className="container-fluid">
            <div
                className="content-heading h1 font-weight-bold text-center"
                style={{ color: "#e5d549" }}
            >
                <Jumbotron text={["Latest Products", "New Arrivals", "Best Sellers"]} />
            </div>

            <h4
                className="text-center p-3 mt-5 display-6 product-headers"
            >New Arrivals</h4>

            <NewArrivals />

            <h4
                className="text-center p-3 mt-5 display-6 product-headers"
            >Best Sellers</h4>

            <BestSellers />

            <h4
                className="text-center p-3 mt-5 display-6 product-headers"
            >Categories</h4>

            <CategoryList />

            <h4
                className="text-center p-3 mt-5 display-6 product-headers"
            >Sub Categories</h4>

            <SubList />
        </div>
    )
}

export default Home
