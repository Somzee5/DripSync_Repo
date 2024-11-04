import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import './ProductCard.css';
import HeroSection from './HeroSection'; // Import HeroSection

const RecommendedCard = () => {
  const path = window.location.pathname.split('/');
  const skintone = path[2];
  const gender = path[3];
  const taskId = path[4]; // Updated to use taskId instead of category

  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedOutfits(gender, skintone, taskId);
  }, [gender, skintone, taskId]);

  const fetchRecommendedOutfits = async (gender, skintone, taskId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get-display-recommended-outfits?gender=${gender}&skintone=${skintone}&search_term=${taskId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } 
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Error fetching recommended outfits:', error);
      setError('Could not fetch recommended outfits');
    }
  };

  const renderCards = () => {
    if (cards.length === 0 && !error) {
      return <div>Wait for the recommendations to get available!</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    const rows = [];
    for (let i = 0; i < cards.length; i += 3) {
      const rowItems = cards.slice(i, i + 3);
      rows.push(
        <div className="card-row" key={`row-${i}`}>
          {rowItems.map((item, index) => (
            <MDBCard className="card" key={`card-${i + index}`}>
              <MDBCardBody>
                <img src={item.URL_image} alt={item.Brand} className="card-image" />
                <h2>{item.Brand}</h2>
                <p>{item.Description}</p>
                <Link
                  to={`/recommended/${skintone}/${gender}/${taskId}/${item.Id_Product}`}
                  className="card-button"
                >
                  Learn More
                </Link>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <>
      <HeroSection /> {/* Render the navbar on top of this page */}
      <div className="card-container">
        {renderCards()}
      </div>
    </>
  );
};

export default RecommendedCard;
