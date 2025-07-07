import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api';
import logo from './lodo.jpg';

const TypingText = () => {
  const phrases = [
    "Your ultimate fashion guide.",
    "Personalized outfits just for you.",
    "Experience virtual try-ons!",
  ];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[index];
    const typingInterval = setInterval(() => {
      if (charIndex < currentPhrase.length) {
        setText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setText("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [charIndex, index]);

  return <div className="text-lg text-gray-400 mt-4">{text}</div>;
};

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
      await api.post('/verify-otp/', { email, otp_input: otp, new_password: newPassword });
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
    <div className="flex h-screen bg-black">
      <div className="flex flex-col justify-center items-start w-1/2 px-10">
        <h1 className="text-6xl font-extrabold text-indigo-400 tracking-wide">
          DripSync
        </h1>
        <TypingText />
      </div>

      <div className="flex justify-center items-center w-1/2 bg-gray-900 p-10">
        <div className="w-full max-w-sm space-y-6">
          <h2 className="text-center text-2xl font-semibold text-gray-100">Log in to your account</h2>
          {!showOtpInput ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-800 border border-gray-700 p-3 text-white focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-800 border border-gray-700 p-3 text-white focus:ring-indigo-500"
                />
              </div>
              <button type="submit" className="w-full rounded-md bg-indigo-500 py-2 text-white font-bold shadow-lg hover:bg-indigo-400">
                Log In
              </button>
              <div className="text-center mt-4">
                <span onClick={handleForgotPassword} className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">
                  Forgot your password? Reset it
                </span>
                <p className="mt-4 text-center text-sm text-gray-400">
                  Don't have an account?{' '}
                  <a href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-800 border border-gray-700 p-3 text-white focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-800 border border-gray-700 p-3 text-white focus:ring-indigo-500"
                />
              </div>
              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
              <button type="submit" className="w-full rounded-md bg-indigo-500 py-2 text-white font-bold shadow-lg hover:bg-indigo-400">
                Verify OTP and Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
