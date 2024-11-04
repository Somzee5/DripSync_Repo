import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import HeroSection from '../Components/HeroSection';
import TaskCard from '../Components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [user_id, setUserID] = useState(null);
  const [gender, setGender] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [waist, setWaist] = useState(null);
  const [skintone, setSkintone] = useState(null);

  useEffect(() => { 
    // Fetch the user ID and profile data from the backend API
    const fetchUserData = async () => {
      try {
        const response = await api.get('/home', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you're using token-based auth
          },
        });
        setUserID(response.data.user_id); // Directly use response.data.user_id
        setHeight(response.data.height);   // Get height
        setWeight(response.data.weight);   // Get weight
        setWaist(response.data.waist);     // Get waist
        setSkintone(response.data.skintone);

        // Set gender based on the response 
        if(response.data.gender === 'Male')
          setGender('men');
        else  
          setGender('women');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = (query) => {
    if (query.length > 1) {
      setSuggestions(['Suggestion 1', 'Suggestion 2', 'Suggestion 3']);
    } else {
      setSuggestions([]);
    }
  };

  // Ensure HeroSection is rendered only when user_id is available
  return (
    <MDBContainer fluid className="home-page">
      {/* Hero Section */}
      {user_id && (
        <HeroSection 
          handleSearch={handleSearch} 
          user_id={user_id} 
          gender={gender} 
          height={height} 
          weight={weight} 
          waist={waist} 
          skintone={skintone}
          suggestions={suggestions} 
        />
      )}

      {/* Product Cards
      <MDBRow className="product-cards mt-5">
        {products.map((product, index) => (
          <MDBCol md="9" key={index}>
            <TaskCard product={product} />
          </MDBCol>
        ))}
      </MDBRow> */}
    </MDBContainer>
  );
};

export default Home;
