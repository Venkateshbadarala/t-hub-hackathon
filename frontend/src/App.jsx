
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Forms/RegisterForm';
import Login from './components/Forms/LoginForm';
import ForgotPassword from './components/Forms/ForgotForm';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';




const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
      
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      
      </Routes>
    </Router>
  );
};

export default App;
