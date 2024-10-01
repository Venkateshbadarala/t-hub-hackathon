
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Forms/RegisterForm';
import Login from './components/Forms/LoginForm';
import ForgotPassword from './components/Forms/ForgotForm';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';
import { HistoryProvider } from './context/useHistory';




const App = () => {
  return (
    <Router>
      <HistoryProvider>
      <Navbar/>
     
      <Routes>
      
        <Route path="/signup" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      
      </Routes>
      </HistoryProvider>
    </Router>
  );
};

export default App;
