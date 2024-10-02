// src/components/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch appointments from Firestore with real-time updates
  useEffect(() => {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, orderBy('appointmentDate', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const appointmentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments.');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle approving or denying appointments
  const handleAppointment = async (id, action) => {
    try {
      const appointmentDoc = doc(db, 'appointments', id);
      await updateDoc(appointmentDoc, {
        status: action === 'approve' ? 'approved' : 'denied'
      });

      // Optionally, display a success notification
      toast.success(`Appointment ${action}d successfully.`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment. Please try again.');
    }
  };

  // Count of pending appointments
  const pendingCount = appointments.filter(app => app.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-100">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Doctor's Dashboard</h1>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
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
                      <p className="font-semibold text-lg">{appointment.patientName || 'Unknown Patient'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(appointment.status === 'pending' || !appointment.status) ? (
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
                          {appointment.status
                            ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
                            : 'Pending'}
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

      <ToastContainer />
    </div>
  );
};

export default DoctorDashboard;
