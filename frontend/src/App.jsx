
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Forms/RegisterForm';
import Login from './components/Forms/LoginForm';
import ForgotPassword from './components/Forms/ForgotForm';
import Dashboard from './components/Dashboard/Dashboard';
<<<<<<< HEAD
import DiaryCard from './components/Dashboard/DiaryCard';
import AddDiary from './components/Dashboard/AddDiary';
=======
>>>>>>> 73b315ac2f8d0e1ca0e9e81d4519a041c0533746


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      
      </Routes>
    </Router>
  );
};

export default App;
