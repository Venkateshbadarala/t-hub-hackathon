import React, { useContext } from 'react';
import { auth } from '../firebase';
import AuthContext from '../AuthContext';

const LogoutButton = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("User logged out");
    }).catch((error) => {
      console.error("Error logging out", error);
    });
  };

  return (
    currentUser && (
      <button onClick={handleLogout} className="p-2 text-white bg-red-500 rounded">
        Logout
      </button>
    )
  );
};

export default LogoutButton;
