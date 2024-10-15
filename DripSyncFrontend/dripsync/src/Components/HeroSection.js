import React, { useState } from 'react';
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
import { Link } from 'react-router-dom'; // Import Link for navigation
import './HeroSection.css';

const HeroSection = ({ handleSearch, user_id, suggestions }) => {
  const [openBasic, setOpenBasic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const renderSuggestions = () => {
    return suggestions.map((suggestion, index) => (
      <div key={index} className="suggestion-item">
        {suggestion}
      </div>
    ));
  };

  const menCategories = [
    'Polo T-shirt', 'Trousers', 'Slim Fit Shirt', 'T-shirt', 'Jeans',
    'Track Pants', 'Shorts', 'Printed Shirt', 'Printed T-shirt',
    'Chinos', 'Joggers', 'pants', 'Jacket', 'Shackets', 'Pyjamas',
    'Bermudas', 'Blazer', 'Hoodie', 'Sweatshirt', 'Pullovers', 'Kurta',
    'Three-Fourths', 'V-Neck T-shirt'
  ];

  const womenCategories = 
    ['Kurtas', 'Kurta Suit Sets', 'Leggings', 'Flared',
      'Salwars & Churidars', 'Printed', 'Jeans & Jeggings',
      'Track Pants', 'Tops', 'T-Shirts', 'Trousers & Pants',
      'Dress Material', 'Camisole', 'Joggers', 'Treggings', 'Shirts',
      'Palazzos & Culottes', 'Capri', 'Skirts & Shorts',
      'Sweatshirts & Hoodies', 'Hoodie', 'Kurti', 'Pullover', 'Sarees',
      'Palazzo', 'Trackpants', 'Jumpsuits & Playsuits',
      'Jackets & Coats', 'Tights', 'Kurtis & Tunics', 'Gown', 'Dupatta',
      'Blouses', 'Shrugs & Boleros', 'Shawls & Wraps',
      'Sweaters & Cardigans', 'Dungarees', 'Skirts',
      'Hipsters', 'Swimsuit', 'Nightgown', 'Briefs'
  ];



  return (
    <MDBNavbar expand='lg' light bgColor='light' className="hero-section">
      <MDBContainer fluid>
        {/* Logo on the Left */}
        <MDBNavbarBrand href='#'>
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

            {/* Search Bar */}
            <MDBNavbarItem className="search-container ms-3">
              <form className='d-flex input-group w-auto position-relative'>
                <MDBInput
                  label='Search for products...'
                  id='search'
                  type='text'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="search-input"
                />
                <MDBBtn color='primary' className="ms-2">Search</MDBBtn>
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
