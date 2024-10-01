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
    toast.success(`Date selected: ${formattedDate}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Diary Calendar</h1>
      <Calendar
        onChange={handleDateChange}
        value={date || new Date()} // Use new Date() only if no date is selected
        className="mb-4"
      />
      <ToastContainer />
    </div>
  );
};

export default DiaryCalendar;
