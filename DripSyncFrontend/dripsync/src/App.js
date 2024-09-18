import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import ProtectedRoute from './Components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Signup} />
        <ProtectedRoute path="/profile/:user_id" component={Profile} />
        <ProtectedRoute path="/me/" component={ProtectedRoute} />
      </Switch>
    </Router>
  );
}

export default App;
