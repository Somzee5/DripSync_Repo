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
} from 'mdb-react-ui-kit';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login/', { email, password });
      const { access, user_id } = response.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('user_id', user_id);

      history.push('/home');
    } 
    catch (error)  
    {
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await api.post('/forgot-password/', { email });
      setShowOtpInput(true);
      setError('');
    } catch (error) {
      setError('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/verify-otp/', {
        email,
        otp_input: otp,
        new_password: newPassword,
      });
      setEmail('');
      setOtp('');
      setNewPassword('');
      setShowOtpInput(false);
      history.push('/'); // Redirect to login page after successful reset
    } catch (error) {
      setOtpError('Invalid or expired OTP');
    }
  };

  return (
    <MDBContainer fluid className='p-3 background-radial-gradient overflow-hidden'>
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            DripSync<br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>outfits for you!</span>
          </h1>
          <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
            DripSync today to unlock personalized outfit suggestions tailored to your style and body type. Create your profile and start your fashion journey with AI-powered recommendations.
          </p>
        </MDBCol>

        <MDBCol md='6' className='position-relative'>
          <MDBCard className='my-5 bg-glass' style={{ maxWidth: '600px', width: '600px', padding: '20px', margin: '0 auto' }}>
            <MDBCardBody className='p-4'>
              <div className="d-flex justify-content-end mb-4">
                <MDBBtn size='md' onClick={() => history.push('/register')}>
                  Sign Up
                </MDBBtn>
              </div>

              {!showOtpInput ? (
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

                  <div className="text-center">
                    <p>Forgot your password? <span style={{ color: '#1266f1', cursor: 'pointer' }} onClick={handleForgotPassword}>Reset it</span></p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Enter OTP'
                    id='otp'
                    type='text'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <MDBInput
                    wrapperClass='mb-4'
                    label='New Password'
                    id='new-password'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  {otpError && <p className="text-danger text-center">{otpError}</p>}
                  <MDBBtn className='w-100 mb-4' size='md' type="submit">
                    Verify OTP and Reset Password
                  </MDBBtn>
                  <div className="text-center">
                    <p>Didn't receive the OTP? <span style={{ color: '#1266f1', cursor: 'pointer' }} onClick={handleForgotPassword}>Resend</span></p>
                  </div>
                </form>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
