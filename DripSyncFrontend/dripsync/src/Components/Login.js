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
  MDBIcon // Add this line
} from 'mdb-react-ui-kit';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page

    try {
      // Make the API request to the login endpoint
      const response = await api.post('/login/', {  // Fixed path
        email,
        password
      });

      // On success, save the token to localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Redirect to the home page after successful login
      history.push('/home');
    } catch (error) {
      // Handle error, e.g., incorrect credentials
      setError('Invalid email or password');
    }
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
              <form onSubmit={handleLogin}>
                <MDBInput
                  wrapperClass='mb-4'
                  label='Email'
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MDBInput
                  wrapperClass='mb-4'
                  label='Password'
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {error && <p className="text-danger text-center">{error}</p>}
                
                <MDBBtn className='w-100 mb-4' size='md' type="submit">
                  Log In
                </MDBBtn>
              </form>

              <div className="text-center">
                <p>Don't have an account? <span style={{color: '#1266f1', cursor: 'pointer'}} onClick={() => history.push('/register')}>Sign Up</span></p>

                <p>or sign in with:</p>

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

export default Login;
