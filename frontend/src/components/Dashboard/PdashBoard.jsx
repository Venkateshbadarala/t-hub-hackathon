// src/components/DoctorDashboard.jsx
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCheck, FaTimes, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
  // Sample data for appointments
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Alice Johnson", date: "2024-10-05", time: "10:00 AM", status: "pending" },
    { id: 2, patient: "Bob Smith", date: "2024-10-06", time: "2:00 PM", status: "pending" },
    { id: 3, patient: "Carol Williams", date: "2024-10-07", time: "11:30 AM", status: "pending" },
  ]);

  // Sample data for patients
  const [patients] = useState([
    { id: 1, name: "Alice Johnson", age: 32, lastVisit: "2024-09-20" },
    { id: 2, name: "Bob Smith", age: 45, lastVisit: "2024-09-25" },
    { id: 3, name: "Carol Williams", age: 28, lastVisit: "2024-09-30" },
  ]);

  // Handle approving or denying appointments
  const handleAppointment = (id, action) => {
    setAppointments(appointments.map(app =>
      app.id === id ? { ...app, status: action === 'approve' ? 'approved' : 'denied' } : app
    ));
  };

  // Count of pending appointments
  const pendingCount = appointments.filter(app => app.status === 'pending').length;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Doctor's Dashboard</h1>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Requests */}
          <section>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Appointment Requests</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {pendingCount} Pending
                </span>
              </div>
              <ul className="space-y-4">
                {appointments.map(appointment => (
                  <motion.li
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                  >
                    {/* Appointment Details */}
                    <div>
                      <p className="font-semibold text-lg">{appointment.patient}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <FaCalendarAlt className="mr-2 h-4 w-4" />
                        {appointment.date}
                        <FaClock className="ml-4 mr-2 h-4 w-4" />
                        {appointment.time}
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAppointment(appointment.id, 'approve')}
                            className="flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 rounded-md text-white text-sm transition-colors"
                          >
                            <FaCheck className="mr-1 h-4 w-4" /> Approve
                          </button>
                          <button
                            onClick={() => handleAppointment(appointment.id, 'deny')}
                            className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm transition-colors"
                          >
                            <FaTimes className="mr-1 h-4 w-4" /> Deny
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </section>

          {/* Patient Details */}
          <section>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
              <div className="space-y-4">
                {patients.map(patient => (
                  <div key={patient.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-4">
                      {/* User Avatar */}
                      <div className="relative">
                        <img
                          src={`https://i.pravatar.cc/100?u=${patient.name}`}
                          alt={patient.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <FaUserCircle className="absolute -bottom-1 -right-1 text-blue-500 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{patient.name}</p>
                        <p className="text-sm text-gray-400">Age: {patient.age}</p>
                      </div>
                    </div>
                    {/* Last Visit */}
                    <div className="text-sm text-gray-400">
                      Last Visit: {patient.lastVisit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
