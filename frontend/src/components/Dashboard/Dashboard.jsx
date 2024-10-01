import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase-config';
import ViewDiaries from './ViewDiary';
import { useNavigate } from 'react-router-dom';
import DiaryCalendar from './Calender';
import AddDiary from './AddDiary';


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
      <h1 className="mb-4 text-2xl font-bold">Welcome to your Dashboard</h1>
      <DiaryCalendar onDateChange={setSelectedDate} />
      <ViewDiaries selectedDate={selectedDate} />
      <AddDiary />
    </div>
  );
};

export default Dashboard;
