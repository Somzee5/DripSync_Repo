// pages/Home.js
import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import HeroSection from '../Components/HeroSection';
import ProductCard from '../Components/ProductCard';

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (query) => {
    // Logic to fetch search suggestions from backend based on query
    // For now, let's just simulate with static data
    if (query.length > 1) {
      setSuggestions(['Suggestion 1', 'Suggestion 2', 'Suggestion 3']);
    } else {
      setSuggestions([]);
    }
  };

  const products = [
    { name: 'Pants', image: '/path/to/pants.jpg', price: 100, discountedPrice: 80 },
    { name: 'Shirt', image: '/path/to/shirt.jpg', price: 120, discountedPrice: 95 }
  ];

  return (
    <MDBContainer fluid className="home-page">
      {/* Hero Section */}
      <HeroSection handleSearch={handleSearch} suggestions={suggestions} />

      {/* Product Cards */}
      <MDBRow className="product-cards mt-5">
        {products.map((product, index) => (
          <MDBCol md="9" key={index}>
            <ProductCard product={product} />
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  );
};

export default Home;
