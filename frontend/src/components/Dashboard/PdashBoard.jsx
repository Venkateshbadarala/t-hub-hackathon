import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { db } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore'; 

const DoctorDashboard = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments for the doctor
  const fetchAppointments = async () => {
    try {
        const appointmentsCollection = collection(db, `doctors/${doctorId}/appointments`);
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(appointmentsList);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

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
                    
                    <div>
                      <p className="font-semibold text-lg">{appointment.patientName}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <FaCalendarAlt className="mr-2 h-4 w-4" />
                        {appointment.appointmentDate}
                        <FaClock className="ml-4 mr-2 h-4 w-4" />
                        {appointment.time}
                      </div>
                    </div>
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
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
