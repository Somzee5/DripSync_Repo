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
import RecommendedCard from './Components/RecommendedCard';
import ProductDetail from './Pages/ProductDetail';
import RecommendedProductDetail from './Pages/RecommendedProductDetail';
import TryOn from './Components/TryOn';

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
        <ProtectedRoute exact path="/recommended/:skintone/:gender/:taskId" component={RecommendedCard} />
        <ProtectedRoute exact path="/recommended/:skintone/:gender/:taskId/:productId" component={RecommendedProductDetail} />


        <ProtectedRoute exact path="/home/recommended" component={ProductCard} />
        <ProtectedRoute exact path="/home/:gender/:subcategory/:productId" component={ProductDetail} />
        <ProtectedRoute path="/myprofile/:user_id" component={PersonalProfile} />
        <ProtectedRoute path="/try-on" component={TryOn} />




      </Switch>
    </Router>
  );
}

export default App;
