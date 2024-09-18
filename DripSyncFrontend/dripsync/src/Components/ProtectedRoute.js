import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import api from '../utils/api';  // Assuming this is where you configure your API calls

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = sessionStorage.getItem('access_token');
        if (accessToken) {
          api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
          await api.get('/me/'); // Check if the user is authenticated
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

  
  
export default ProtectedRoute;
