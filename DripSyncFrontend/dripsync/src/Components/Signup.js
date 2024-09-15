import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api'; // Assuming you're using the api utility for HTTP requests
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon // Add this line
} from 'mdb-react-ui-kit';

const Signup = () => {
  const history = useHistory();

  // State management for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [error, setError] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await api.post('/register/', {  // Fixed path
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        tc: formData.termsAccepted
      });
      
      // Redirect to login page on successful registration
      history.push('/');
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration. Please try again.');
    }
  };

  const handleLoginClick = () => {
    history.push('/');
  };

  return (
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            DripSync<br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>outfits for you!</span>
          </h1>
          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
            DripSync today to unlock personalized outfit suggestions tailored to your style and body type. Create your profile and start your fashion journey with AI-powered recommendations.
          </p>
        </MDBCol>

        <MDBCol md='6' className='position-relative'>
          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol col='6'>
                    <MDBInput
                      wrapperClass='mb-4'
                      label='First name'
                      id='firstName'
                      type='text'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </MDBCol>
                  <MDBCol col='6'>
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Last name'
                      id='lastName'
                      type='text'
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Email'
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  id='password'
                  type='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Confirm Password'
                  id='confirmPassword'
                  type='password'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <MDBCheckbox
                  wrapperClass='mb-4'
                  id='termsAccepted'
                  label='I agree to the terms and conditions'
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                />
                {error && <p className="text-danger text-center">{error}</p>}
                <MDBBtn className='w-100 mb-4' size='md' type="submit">
                  Sign Up
                </MDBBtn>
                <p className='text-center'>
                  Already have an account? <span style={{color: '#1266f1', cursor: 'pointer'}} onClick={handleLoginClick}>Log In</span>
                </p>
              </form>

              <div className="text-center">
                <p>or sign up with:</p>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/> {/* Use MDBIcon here */}
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='twitter' size="sm"/> {/* Use MDBIcon here */}
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/> {/* Use MDBIcon here */}
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='github' size="sm"/> {/* Use MDBIcon here */}
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
