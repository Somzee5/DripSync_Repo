import React from 'react';
import { useParams } from 'react-router-dom';
import HeroSection from '../Components/HeroSection'; // Adjust the path based on your structure
import './ProductDetail.css'; // Ensure you have this CSS file for styling

const ProductDetail = () => {
  const { productId } = useParams();

  // Demo product data
  const demoProducts = [
    {
      id: '1',
      name: 'Tapered Jeans',
      description: 'Comfortable tapered jeans with a stylish fit, perfect for any occasion.',
      price: '$49.99',
      imageUrl: 'https://via.placeholder.com/400', // Placeholder image
    },
    {
      id: '2',
      name: 'Classic T-Shirt',
      description: 'A classic cotton t-shirt, versatile for any wardrobe.',
      price: '$19.99',
      imageUrl: 'https://via.placeholder.com/400', // Placeholder image
    },
    {
      id: '3',
      name: 'Sporty Sneakers',
      description: 'Trendy sneakers designed for both comfort and style.',
      price: '$59.99',
      imageUrl: 'https://via.placeholder.com/400', // Placeholder image
    },
  ];

  // Find the product based on the productId
  const product = demoProducts.find((p) => p.id === productId);

  // Handle case where product is not found
  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="product-detail-page">
      <HeroSection /> {/* Use your existing HeroSection component */}
      <div className="product-detail-container">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>{product.price}</h3>
          <div className="button-container">
            <button className="buy-now-button">Buy Now</button>
            <button className="try-on-button">Try On</button>
          </div>
        </div>
      </div>
      <div className="recommendations">
        <h2>You might also like:</h2>
        <div className="recommendation-cards">
          {demoProducts.map((recProduct) => (
            <div key={recProduct.id} className="recommendation-card">
              <img src={recProduct.imageUrl} alt={recProduct.name} />
              <h3>{recProduct.name}</h3>
              <p>{recProduct.price}</p>
              <button className="view-details-button">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
