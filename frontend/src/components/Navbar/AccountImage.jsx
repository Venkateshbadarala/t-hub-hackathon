import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase-config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AccountImage = () => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid); // Assuming your user data is stored in a 'users' collection
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      navigate('/'); // Redirect to the root route
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex items-center">
      <img 
        src={userData?.profileImageUrl || "https://placehold.co/300x300.png"} 
        alt="Profile"
        className="w-10 border border-black rounded-full"
      />
      <div className="ml-2">
        <p className="text-gray-200">{userData ? userData.displayName || user.email : 'Guest'}</p> 
        <button 
          onClick={handleLogout} 
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountImage;
