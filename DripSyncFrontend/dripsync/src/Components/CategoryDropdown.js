// components/CategoryDropdown.js
import React from 'react';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';

const CategoryDropdown = ({ title, categories }) => {
  return (
    <MDBDropdown>
      <MDBDropdownToggle>{title}</MDBDropdownToggle>
      <MDBDropdownMenu>
        {categories.map((category, index) => (
          <MDBDropdownItem key={index}>{category}</MDBDropdownItem>
        ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
};

export default CategoryDropdown;
