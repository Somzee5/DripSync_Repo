import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const location = useLocation();
  const path = location.pathname.split('/');
  const gender = path[2];  // Assuming gender is at the 3rd position in the URL
  const productId = path[4];  // Assuming productId is at the 5th position

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId, gender]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-product-details?product_id=${productId}&gender=${gender}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProduct(data);
      console.log('Fetched product:', data); // Debugging log
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <img src={product.URL_image} alt={product.Brand} className="product-image" />
        <h2>{product.Brand}</h2>
        <p>{product.Description}</p>
        <p><strong>Category:</strong> {product.Category}</p>
        <p><strong>Discount Price:</strong> Rs. {product['Discount Price (in Rs.)']}</p>
        <p><strong>Original Price:</strong> Rs. {product['Original Price (in Rs.)']}</p>
        <p><strong>Color:</strong> {product.Color}</p>
        <p><strong>Wear Type:</strong> {product.Wear_Type}</p>
        <a href={product.Product_URL} target="_blank" rel="noopener noreferrer" className="product-link">Buy Now</a>
      </div>
    </div>
  );
};

export default ProductDetail;
