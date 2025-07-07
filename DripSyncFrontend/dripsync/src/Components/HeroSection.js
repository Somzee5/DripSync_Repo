import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ user_id, gender, height, weight, waist, skintone }) => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [personalizedCategories, setPersonalizedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({ men: false, women: false, recommendations: false });

  const menCategories = ['Polo T-shirt', 'Trousers', 'Slim Fit Shirt', 'T-shirt', 'Jeans', 'Track Pants', 'Shorts', 'Printed Shirt', 'Printed T-shirt', 'Chinos', 'Joggers', 'Pants', 'Jacket', 'Shackets', 'Pyjamas', 'Bermudas', 'Blazer', 'Hoodie', 'Sweatshirt', 'Pullovers', 'Kurta', 'Three-Fourths', 'V-Neck T-shirt'];
  const womenCategories = ['Kurtas', 'Kurta Suit Sets', 'Leggings', 'Flared', 'Salwars & Churidars', 'Printed', 'Jeans & Jeggings', 'Track Pants', 'Tops', 'T-Shirts', 'Trousers & Pants', 'Dress Material', 'Camisole', 'Joggers', 'Treggings', 'Shirts', 'Palazzos & Culottes', 'Capri', 'Skirts & Shorts', 'Sweatshirts & Hoodies', 'Hoodie', 'Kurti', 'Pullover', 'Sarees', 'Palazzo', 'Trackpants', 'Jumpsuits & Playsuits', 'Jackets & Coats', 'Tights', 'Kurtis & Tunics', 'Gown', 'Dupatta', 'Blouses', 'Shrugs & Boleros', 'Shawls & Wraps', 'Sweaters & Cardigans', 'Dungarees', 'Skirts', 'Hipsters', 'Swimsuit', 'Nightgown', 'Briefs'];

  // Fetch suggestions and personalized categories
  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-suggestions?search_term=${searchQuery}&gender=${gender}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const fetchPersonalizedCategories = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get-personalized-categories?gender=${gender}&height=${height}&weight=${weight}&waist=${waist}&skintone=${skintone}`
      );
      const data = await response.json();
      setPersonalizedCategories(data);
    } catch (error) {
      console.error('Error fetching personalized categories:', error);
      setPersonalizedCategories([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) fetchSuggestions();
    history.push(`/home/${gender}/${searchQuery}`);
  };

  useEffect(() => {
    if (gender && height && weight && waist && skintone) fetchPersonalizedCategories();
  }, [gender, height, weight, waist, skintone]);

  return (
    <nav className="bg-#111817 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="text-xl font-bold">
          <img src={require('./Logo_Dripsync_final.png')} alt="DripSync Logo" className="h-16 inline" />
        </Link>

        {/* Navbar Links */}
        <div className="flex space-x-8">
          {/* Men Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen({ ...dropdownOpen, men: !dropdownOpen.men })}
              className="hover:text-purple-500"
            >
              Men
            </button>
            {dropdownOpen.men && (
              <div className="category-dropdown">
                <div className="dropdown-columns">
                  {menCategories.map((category, index) => (
                    <Link
                      to={`/home/men/${category}`}
                      key={index}
                      className="category-item"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Women Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen({ ...dropdownOpen, women: !dropdownOpen.women })}
              className="hover:text-purple-500"
            >
              Women
            </button>
            {dropdownOpen.women && (
              <div className="category-dropdown">
                <div className="dropdown-columns">
                  {womenCategories.map((category, index) => (
                    <Link
                      to={`/home/women/${category}`}
                      key={index}
                      className="category-item"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen({ ...dropdownOpen, recommendations: !dropdownOpen.recommendations })}
              className="hover:text-purple-500"
            >
              Recommendations!
            </button>
            {dropdownOpen.recommendations && (
              <div className="category-dropdown">
                <div className="dropdown-columns">
                  {personalizedCategories.map((category, index) => (
                    <Link
                      to={`/recommended/${skintone}/${gender}/${category}`}
                      key={index}
                      className="category-item"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex items-center ml-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={fetchSuggestions}
            className="bg-gray-800 text-white rounded-full px-4 py-2 mr-2 focus:outline-none"
          />
          <button type="submit" className="bg-purple-600 px-3 py-2 rounded-full hover:bg-purple-700">
            Search
          </button>
          {suggestions.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white text-gray-900 rounded-md shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <Link
                  to={`/home/${gender}/${suggestion}`}
                  key={index}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          )}
        </form>

        {/* Profile Icon */}
        {user_id && (
          <Link to={`/myprofile/${user_id}`} className="ml-4 text-white hover:text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c4.418 0 8-3.582 8-8S16.418 2 12 2 4 5.582 4 10s3.582 4 8 4zm0 2c-3.313 0-6 2.687-6 6v1h12v-1c0-3.313-2.687-6-6-6z" />
          </svg>
        </Link>
        )}
      </div>
    </nav>
  );
};

export default HeroSection;
