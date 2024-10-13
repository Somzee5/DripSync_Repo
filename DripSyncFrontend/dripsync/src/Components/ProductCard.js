import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import './ProductCard.css';

const ProductCard = () => {
  const path = window.location.pathname.split('/');
  const gender = path[2];  // Assuming it's at the 3rd position
  const taskId = path[3];  // Assuming it's at the 4th position

  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subcategory, setSubcategory] = useState('');

  useEffect(() => {
    setSearchTerm(taskId);  // Set taskId as searchTerm
    fetchData(gender, taskId);  // Fetch data based on gender and taskId
  }, [gender, taskId]);

  const fetchData = async (gen, subcategory) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-data?search_term=${subcategory}&gender=${gen}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderCards = () => {
    const rows = [];
    for (let i = 0; i < cards.length; i += 3) {
      const rowItems = cards.slice(i, i + 3); // Get a row of three items
      rows.push(
        <div className="card-row" key={`row-${i}`}>
          {rowItems.map((item, index) => (
            <MDBCard className="card" key={`card-${i + index}`}>
              <MDBCardBody>
                <img
                  src={item.URL_image}
                  alt={item.Brand}
                  className="card-image"
                />
                <h2>{item.Brand}</h2>
                <p>{item.Description}</p>
                <Link 
                  to={`/home/${gender}/${taskId}/${item.Id_Product}`} // Ensure taskId is always included
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
    <div className="card-container">
      {cards.length > 0 ? renderCards() : <div>No cards available!</div>}
    </div>
  );
};

export default ProductCard;
