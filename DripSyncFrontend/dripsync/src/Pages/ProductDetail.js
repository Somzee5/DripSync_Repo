import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './ProductDetail.css';
import './RelatedProduct.css';
import HeroSection from '../Components/HeroSection'; // Importing HeroSection

const ProductDetail = () => {
  const location = useLocation();
  const path = location.pathname.split('/');
  const gender = path[2];  // Assuming gender is at the 3rd position in the URL
  const productId = path[4];  // Assuming productId is at the 5th position
  const history = useHistory();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [productId, gender]);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]); // Runs every time productId changes

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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      <HeroSection /> {/* Include HeroSection here */}
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

      <div className="related-products-container">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.Id_Product} className="related-product-card">
              <img src={relatedProduct.URL_image} alt={relatedProduct.Brand} className="related-product-image" />
              <h4>{relatedProduct.Brand}</h4>
              <p>{relatedProduct.Description}</p>
              <button
                className="learn-more-button"
                onClick={() => handleLearnMoreClick(relatedProduct.Id_Product, relatedProduct.Category)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
