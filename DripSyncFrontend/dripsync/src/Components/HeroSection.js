import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { Link, useHistory } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ user_id, gender, height, weight, waist, skintone }) => {
  const history = useHistory();
  const [openBasic, setOpenBasic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [personalizedCategories, setPersonalizedCategories] = useState([]);

  // Effect for fetching personalized categories when any of the parameters change
  useEffect(() => {
    if (gender && height && weight && waist && skintone) {
      fetchPersonalizedCategories();
    }
  }, [gender, height, weight, waist, skintone]);

  useEffect(() => {
    console.log('Personalized Categories State:', personalizedCategories);
  }, [personalizedCategories]);

  // Fetch search suggestions based on search term
  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-suggestions?search_term=${searchQuery}&gender=${gender}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]); // Clear suggestions on error
    }
  };

  // Fetch personalized categories
  const fetchPersonalizedCategories = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get-personalized-categories?gender=${gender}&height=${height}&weight=${weight}&waist=${waist}&skintone=${skintone}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      const data = await response.json();
      setPersonalizedCategories(data);
    } catch (error) {
      console.error('Error fetching personalized categories:', error);
      setPersonalizedCategories([]); // Clear personalized categories on error
    }
  };

  // Handle search form submission
  const handleSearchBar = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchSuggestions();
    }
    history.push(`/home/${gender}/${searchQuery}`);
  };

  // Render suggestions
  const renderSuggestions = () => {
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return <div>No suggestions available.</div>;
    }

    return suggestions.map((suggestion, index) => (
      <div key={index}>
        <Link to={`/home/${gender}/${suggestion}`} className="suggestion-item">
          {suggestion}
        </Link>
      </div>
    ));
  };

  // Render personalized categories
  const renderPersonalizedCategories = () => {
    if (!Array.isArray(personalizedCategories) || personalizedCategories.length === 0) {
      return <div>No personalized categories available.</div>;
    }

    return personalizedCategories.map((category, index) => (
      <div key={index}>
        <Link to={`/recommended/${skintone}/${gender}/${category}`} className="category-item">
          {category}
        </Link>
      </div>
    ));
  };

  // Define men and women categories
  const menCategories = ['Polo T-shirt', 'Trousers', 'Slim Fit Shirt', 'T-shirt', 'Jeans',
    'Track Pants', 'Shorts', 'Printed Shirt', 'Printed T-shirt',
    'Chinos', 'Joggers', 'pants', 'Jacket', 'Shackets', 'Pyjamas',
    'Bermudas', 'Blazer', 'Hoodie', 'Sweatshirt', 'Pullovers', 'Kurta',
    'Three-Fourths', 'V-Neck T-shirt'];
  const womenCategories = ['Kurtas', 'Kurta Suit Sets', 'Leggings', 'Flared',
    'Salwars & Churidars', 'Printed', 'Jeans & Jeggings',
    'Track Pants', 'Tops', 'T-Shirts', 'Trousers & Pants',
    'Dress Material', 'Camisole', 'Joggers', 'Treggings', 'Shirts',
    'Palazzos & Culottes', 'Capri', 'Skirts & Shorts',
    'Sweatshirts & Hoodies', 'Hoodie', 'Kurti', 'Pullover', 'Sarees',
    'Palazzo', 'Trackpants', 'Jumpsuits & Playsuits',
    'Jackets & Coats', 'Tights', 'Kurtis & Tunics', 'Gown', 'Dupatta',
    'Blouses', 'Shrugs & Boleros', 'Shawls & Wraps',
    'Sweaters & Cardigans', 'Dungarees', 'Skirts',
    'Hipsters', 'Swimsuit', 'Nightgown', 'Briefs'];

  return (
    <MDBNavbar expand='lg' light bgColor='light' className="hero-section">
      <MDBContainer fluid>
        {/* Logo on the Left */}
        <MDBNavbarBrand href='/home'>
          <img src={require('./logo.png')} alt='DripSync Logo' className='logo' />
        </MDBNavbarBrand>

        {/* Toggler for mobile view */}
        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded={openBasic}
          aria-label='Toggle navigation'
          onClick={() => setOpenBasic(!openBasic)}
        />

        <MDBCollapse navbar show={openBasic}>
          <MDBNavbarNav className='ms-auto mb-2 mb-lg-0 align-items-center'>
            {/* Men Categories */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Men
                </MDBDropdownToggle>
                <MDBDropdownMenu className="category-dropdown">
                  <div className="dropdown-columns">
                    {menCategories.map((category, index) => (
                      <MDBDropdownItem key={index} link>
                        <Link to={`/home/men/${category}`}>{category}</Link>
                      </MDBDropdownItem>
                    ))}
                  </div>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Women Categories */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Women
                </MDBDropdownToggle>
                <MDBDropdownMenu className="category-dropdown">
                  <div className="dropdown-columns">
                    {womenCategories.map((category, index) => (
                      <MDBDropdownItem key={index} link>
                        <Link to={`/home/women/${category}`}>{category}</Link>
                      </MDBDropdownItem>
                    ))}
                  </div>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Personalized Recommendation categories */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Personalizations
                </MDBDropdownToggle>
                <MDBDropdownMenu className="category-dropdown">
                  <div className="dropdown-columns">
                    {renderPersonalizedCategories()}
                  </div>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Search Bar */}
            <MDBNavbarItem className="search-container ms-3">
              <form className='d-flex input-group w-auto position-relative' onSubmit={handleSearchBar}>
                <MDBInput
                  label='Search for products...'
                  id='search'
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  onKeyUp={fetchSuggestions} // Fetch suggestions on keyup
                />
                <MDBBtn color='primary' type='submit' className="ms-2">Search</MDBBtn>
                {searchQuery && (
                  <div className="search-suggestions position-absolute bg-white border rounded mt-2 p-2" style={{ zIndex: 1000, width: '100%' }}>
                    {renderSuggestions()}
                  </div>
                )}
              </form>
            </MDBNavbarItem>

            {/* Profile Icon - Conditional rendering */}
            {user_id && (
              <MDBNavbarItem className="ms-3">
                <Link to={`/myprofile/${user_id}`} className="nav-link">
                  <MDBIcon fas icon="user" size="lg" />
                </Link>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default HeroSection;
