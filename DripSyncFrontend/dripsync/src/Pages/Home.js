import React, { useState, useEffect } from 'react';
import HeroSection from '../Components/HeroSection';
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
    const fetchUserData = async () => {
      try {
        const response = await api.get('/home', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserID(response.data.user_id);
        setHeight(response.data.height);
        setWeight(response.data.weight);
        setWaist(response.data.waist);
        setSkintone(response.data.skintone);
        setGender(response.data.gender === 'Male' ? 'men' : 'women');
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

  return (
    <div className="bg-black text-purple-500 min-h-screen p-5">
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

      {/* Horizontal Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {/* New Arrivals Card */}
        <div className="bg-purple-800 text-white p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-bold mb-3">New Arrivals</h3>
          <p className="mb-4">Discover the latest styles and trends in fashion. New arrivals every week!</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
            Shop Now
          </button>
        </div>

        {/* Xmas Collection Card */}
        <div className="bg-purple-800 text-white p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-bold mb-3">Xmas Collection</h3>
          <p className="mb-4">Celebrate the holiday season in style with our exclusive Xmas collection.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
            Shop Now
          </button>
        </div>

        {/* Traditionals Card */}
        <div className="bg-purple-800 text-white p-5 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-bold mb-3">Traditionals</h3>
          <p className="mb-4">Embrace culture and heritage with our traditional wear collection.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
