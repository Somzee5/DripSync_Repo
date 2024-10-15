import React, { useEffect, useState } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import HeroSection from '../Components/HeroSection'; // Adjust the path based on your structure
import api from '../utils/api'; // Make sure to import your api utility for requests
import './ProductDetail.css'; // Ensure you have this CSS file for styling

const ProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  const path = location.pathname.split('/');
  const gender = path[2];  // Assuming gender is at the 3rd position in the URL
  const history = useHistory();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [productId, gender]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-product-details?product_id=${productId}&gender=${gender}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-related-products?product_id=${productId}&gender=${gender}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRelatedProducts(data);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleLearnMoreClick = (relatedProductId, relatedProductCategory) => {
    history.push(`/home/${gender}/${relatedProductCategory}/${relatedProductId}`);
  };

  const addToWardrobe = async () => {
    const userId = sessionStorage.getItem('user_id');

    const data = {
      user: userId,
      Id_Product: product.Id_Product,
      Product_URL: product.Product_URL,
      URL_image: product.URL_image,
      Description: product.Description,
      Price: product['Original Price (in Rs.)'],
      added_date: new Date().toISOString(),
    };

    try {
      const response = await api.post('/wardrobe/', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      });
      alert('Product added to wardrobe successfully!');
    } catch (error) {
      console.error('Error adding to wardrobe:', error);
      alert('Failed to add to wardrobe. Please try again.');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      <HeroSection />
      <div className="product-detail-container">
        <div className="product-image">
          <img src={product.URL_image} alt={product.Brand} />
        </div>
        <div className="product-info">
          <h1 className="product-name">{product.Brand}</h1>
          <p className="product-description">{product.Description}</p>
          <p className="product-category"><strong>Category:</strong> {product.Category}</p>
          <p className="product-color"><strong>Color:</strong> {product.Color}</p>
          <p className="product-wear-type"><strong>Wear Type:</strong> {product.Wear_Type}</p>
          <div className="price-section">
            <span className="discounted-price">Rs. {product['Discount Price (in Rs.)']}</span>
            <span className="original-price"><s>Rs. {product['Original Price (in Rs.)']}</s></span>
          </div>
          <div className="button-container">
            <a href={product.Product_URL} target="_blank" rel="noopener noreferrer">
              <button className="buy-now-button">Buy Now</button>
            </a>
            <button onClick={addToWardrobe} className="add-to-wardrobe-button">Add to Wardrobe</button>
            <button className="try-on-button">Try On</button>
          </div>
        </div>
      </div>
      <div className="recommendations">
        <h2>You might also like:</h2>
        <div className="recommendation-cards">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.Id_Product} className="recommendation-card">
              <img src={relatedProduct.URL_image} alt={relatedProduct.Brand} />
              <h3>{relatedProduct.Brand}</h3>
              <p>{relatedProduct['Discount Price (in Rs.)']}</p>
              <button
                className="view-details-button"
                onClick={() => handleLearnMoreClick(relatedProduct.Id_Product, relatedProduct.Category)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
