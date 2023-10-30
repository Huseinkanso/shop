import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded ">
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.image} variant="top" className="w-100 img-card" style={{ height:'260px' }}   />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`} className="text-decoration-none fs-5">
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
