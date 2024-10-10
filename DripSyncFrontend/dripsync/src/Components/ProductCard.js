import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MDBCard, MDBCardBody, MDBBtn } from 'mdb-react-ui-kit';
import './ProductCard.css';
import { useLocation } from 'react-router-dom';
const ProductCard = ({ product }) => {
  return (
    <MDBCard className="card">
      <MDBCardBody>
        <img
          src={product.URL_image}
          alt={product.Brand}
          className="card-image"
        />
        <h5>{product.Brand}</h5>
        <p>{product.Description}</p>
        <MDBBtn onClick={() => alert(`Learn more about ${product.Brand}`)}>
          Learn More
        </MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
};

const TaskCard = () => {
  const { gender, taskId } = useParams();
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation(); 
  let gen = "";
  let subcategory;

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    gen = pathParts[2];
    subcategory = pathParts[3];
  
    setSearchTerm(taskId);
    fetchData();
  }, [taskId, gender,location]);

  const fetchData = async () => {
    try {
      // const pathParts = location.pathname.split('/');
      // const gen = pathParts[2];
      // const subcategory = pathParts[3];
      const response = await fetch(`http://127.0.0.1:5000/get-data?search_term=${subcategory}&gender=${gen}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setCards(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderCards = () => {
    const rows = [];
    for (let i = 0; i < cards.length; i += 3) {
      const rowItems = cards.slice(i, i + 3);
      rows.push(
        <div className="card-row" key={`row-${i}`}>
          {rowItems.map((item, index) => (
            <ProductCard key={`card-${i + index}`} product={item} />
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
export default TaskCard;