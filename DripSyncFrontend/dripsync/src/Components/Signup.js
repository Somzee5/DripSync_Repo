import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';

const Signup = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked
    });
  };

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
      const response = await api.post('/register/', {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password, 
        password2: formData.confirmPassword,
        tc: formData.termsAccepted
      });

      const { access, user_id } = response.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('user_id', user_id); // Store user_id in sessionStorage
      
      history.push(`/profile/${user_id}`);
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
      <MDBRow className="justify-content-center align-items-center">
        {/* DripSync Welcome Text on the Left */}
        <MDBCol md='3' className='text-center text-md-start d-flex flex-column justify-content-center'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-4" style={{color: 'hsl(218, 81%, 95%)'}}>
            DripSync<br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>outfits for you!</span>
          </h1>
          <p className='px-4' style={{color: 'hsl(218, 81%, 85%)'}}>
            DripSync today to unlock personalized outfit suggestions tailored to your style and body type. Create your profile and start your fashion journey with AI-powered recommendations.
          </p>
        </MDBCol>

        {/* Signup Form Card */}
        <MDBCol md='9' className='position-relative'>
          <MDBCard className='my-5 bg-glass' style={{ maxWidth: '800px', padding: '30px', margin: '20px auto' }}>
            <MDBCardBody className='p-4'>
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
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Signup;
