// components/ProductCard.js
import React from 'react';
import { MDBCard, MDBCardBody, MDBBtn } from 'mdb-react-ui-kit';

const ProductCard = ({ product }) => {
  return (
    <MDBCard>
      <MDBCardBody>
        <img src={product.image} alt={product.name} className="img-fluid" />
        <h5>{product.name}</h5>
        <p>Price: ${product.price} <span className="discounted-price">${product.discountedPrice}</span></p>
        <MDBBtn onClick={() => alert(`Try on ${product.name}`)}>Try On</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ProductCard;
