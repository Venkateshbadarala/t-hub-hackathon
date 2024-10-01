import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DiaryCalendar = ({ onDateChange }) => {
  const [date, setDate] = useState(undefined); // Start with undefined

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateChange(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-2xl font-bold text-white">Diary Calendar</h1>
      <Calendar
    
        onChange={handleDateChange}
        value={date || new Date()}
        className="mb-4 rounded-[5px] calender " 
      />
      <ToastContainer />
    </div>
  );
};

export default DiaryCalendar;
