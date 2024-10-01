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
    <div className="flex p-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
        <ViewDiaries selectedDate={selectedDate} />
        <div className=''>
        <AddDiary /> </div>
      </div>
      <div className="flex-none ml-4"> 
        <DiaryCalendar onDateChange={setSelectedDate} />
      </div>
    </div>
  );
};

export default Dashboard;
