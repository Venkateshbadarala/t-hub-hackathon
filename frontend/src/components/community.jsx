// src/components/Community.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';

const Community = () => {
  const [users, setUsers] = useState([]);

  // Fetch user names from Firestore or any other source
  useEffect(() => {
    const usersRef = collection(db, 'users'); // Change 'users' to your collection name

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold">{user.name || 'Unknown User'}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Community;
