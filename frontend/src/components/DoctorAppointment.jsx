// src/components/DoctorBooking.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase-config"; // Ensure your firebase-config is set up correctly
import { getDocs, collection, addDoc } from "firebase/firestore"; // Removed 'doc' import as it's no longer needed
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import { UserIcon } from '@heroicons/react/outline';

const DoctorBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Use a Date object
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientName, setPatientName] = useState(''); // New state for patient name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch doctors from Firestore when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, 'doctors'); // Ensure 'doctors' is the correct collection name
        const doctorsSnapshot = await getDocs(doctorsCollection);
        const doctorsList = doctorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(doctorsList);
        if (doctorsList.length > 0) {
          setSelectedDoctor(doctorsList[0].id); // Set default selected doctor if available
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to fetch doctors.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date); // Update selected date
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handlePatientNameChange = (event) => {
    setPatientName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!patientName.trim()) {
      alert('Please enter your name.');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString(); // Format date for display
    const appointmentData = {
      patientName: patientName.trim(),
      appointmentDate: selectedDate.toISOString(), // Store as ISO string for better querying
      doctorId: selectedDoctor,
      createdAt: new Date() // Optional: timestamp of booking
    };

    try {
      const appointmentsCollection = collection(db, 'appointments'); // New top-level 'appointments' collection
      await addDoc(appointmentsCollection, appointmentData);

      alert(`Appointment booked with ${doctors.find(doc => doc.id === selectedDoctor).name} on ${formattedDate}`);

      // Optionally, reset the form after submission
      setSelectedDate(new Date());
      setSelectedDoctor(doctors[0]?.id || '');
      setPatientName('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Book a Doctor Appointment</h2>
        <form onSubmit={handleSubmit}>
          {/* Patient Name Input */}
          <div className="mb-4">
            <label htmlFor="patientName" className="block text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={handlePatientNameChange}
              required
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-300 mb-2">
              Select Date
            </label>
            <div className="border rounded-md">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate} // Set selected date in Calendar
                className="text-black bg-slate-100"
                minDate={new Date()} // Block dates before today
              />
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="mb-4">
            <label htmlFor="doctor" className="block text-gray-300 mb-2">
              Select Doctor
            </label>
            <div className="flex items-center border border-gray-600 rounded-md">
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={handleDoctorChange}
                required
                className="bg-gray-700 text-white p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              <UserIcon className="h-5 w-5 text-gray-400 ml-2" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorBooking;
