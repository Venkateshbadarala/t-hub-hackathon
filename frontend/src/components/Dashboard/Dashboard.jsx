import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase-config';
import ViewDiaries from './ViewDiary';
import { useNavigate } from 'react-router-dom';
import DiaryCalendar from './Calender';
import AddDiary from './AddDiary';
import EmotionalGraph from './EmotionGraph';
import Navbar from '../Navbar/Navbar';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    } else {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          setUser(currentUser.email);
          sessionStorage.setItem('user', currentUser.email); 
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
    <div>
      
   <Navbar/>
    <div className="flex pt-[6%] justify-around  ">
      <div className="fixed left-0">
       
        <ViewDiaries selectedDate={selectedDate} />
        
      </div>
      <div className="fixed right-10"> 
        <DiaryCalendar onDateChange={setSelectedDate} />
        <EmotionalGraph/>
       
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
