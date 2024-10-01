import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase-config';
import ViewDiaries from './ViewDiary';
import { useNavigate } from 'react-router-dom';
import DiaryCalendar from './Calender';
import AddDiary from './AddDiary';
import Navbar from '../Navbar/Navbar';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    } else {
     
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          setUser(currentUser.email);
          localStorage.setItem('user', currentUser.email); 
        } else {
          navigate('/login');
        }
      });
      return () => unsubscribe(); 
    }
  }, [navigate]);


  useEffect(() => {
    console.log('Selected date changed:', selectedDate);
  }, [selectedDate]);


  if (!user) {
    return null; 
  }

  return (
    <div className="p-6">
      
      <DiaryCalendar onDateChange={setSelectedDate} />
      <ViewDiaries selectedDate={selectedDate} />
      <AddDiary />
    </div>
  );
};

export default Dashboard;
