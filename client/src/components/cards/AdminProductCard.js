import React from 'react';
import { Card } from "antd";
import laptop from "../../images/laptop.jpg";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

function AdminProductCard({ product, handleRemove }) {
    const { title, description, images, slug } = product;

    return (
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
                <Link to={`/admin/product/${slug}`}>
                    <EditOutlined className="text-warning" />
                </Link>,
                <DeleteOutlined
                    className="text-danger"
                    onClick={() => handleRemove(slug)}
                />
            ]}
            style={{ width: 300 }}
        >
            <Meta title={title} description={`${description && description.substring(0, 34)}`} />
        </Card>
    )
}

export default AdminProductCard;
