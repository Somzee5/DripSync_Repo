import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api';
import logo from './lodo.jpg'; // Importing the image

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
    } catch (error) {
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
      history.push('/');
    } catch (error) {
      setOtpError('Invalid or expired OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-900 to-black text-gray-200">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <img src={logo} alt="DripSync Logo" className="w-50 h-50 object-contain" />
        </div>
        <p className="text-center text-lg text-gray-300">
          Unlock personalized outfit suggestions with AI-powered recommendations
        </p>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => history.push('/register')}
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign Up
            </button>
          </div>

          {!showOtpInput ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold shadow-md"
              >
                Log In
              </button>

              <div className="text-center mt-4">
                <span
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300"
                >
                  Forgot your password? Reset it
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold shadow-md"
              >
                Verify OTP and Reset Password
              </button>

              <div className="text-center mt-4">
                <span
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300"
                >
                  Didn’t receive the OTP? Resend
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
