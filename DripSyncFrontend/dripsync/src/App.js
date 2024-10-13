import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import VerifyOtp from './Components/VerifyOtp';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './Pages/Home';
import PersonalProfile from './Pages/PersonalProfile';
import ProductCard from './Components/ProductCard';
import ProductDetail from './Pages/ProductDetail';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/verify-otp" component={VerifyOtp} />
        <Route path="/register" component={Signup} />
        <ProtectedRoute path="/profile/:user_id" component={Profile} />
        <ProtectedRoute path="/me/" component={ProtectedRoute} />
        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute exact path="/home/:gender/:taskId" component={ProductCard} />
        <ProtectedRoute exact path="/home/:gender/:subcategory/:productId" component={ProductDetail} />
        <ProtectedRoute path="/myprofile/:user_id" component={PersonalProfile} />
      </Switch>
    </Router>
  );
}

export default App;
