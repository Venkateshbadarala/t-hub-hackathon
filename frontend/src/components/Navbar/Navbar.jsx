// Navbar.js
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import DarkModeToggle from './ThemeSwitch';
import AccountImage from './AccountImage';
import { FaFire } from 'react-icons/fa';
import { auth, db } from '../../firebase-config';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Tooltip, useColorMode } from '@chakra-ui/react';

const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [allDiaries, setAllDiaries] = useState([]);
  const { colorMode } = useColorMode(); // To determine current theme
  const [postsCount, setPostsCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
        setPostsCount(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen for changes in the user's diaries collection
  useEffect(() => {
    if (!userEmail) {
      setAllDiaries([]);
      setPostsCount(0);
      setLoading(false);
      return;
    }

    const diariesRef = collection(db, 'users', userEmail, 'diaries');
    const q = query(diariesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const diaries = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
          date: new Date(docSnap.data().date),
        }));
        setAllDiaries(diaries);
        setPostsCount(diaries.length);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching diaries:', err);
        setError('Failed to load posts.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userEmail]);

  // Handle scroll to hide/show Navbar
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined) { // Ensure previous is defined
      if (latest > previous && latest > 20) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' }, // Adjust to '-100%' to hide completely
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`flex flex-row items-center justify-between px-6 py-4 
          ${colorMode === 'dark' ? 'bg-gray-800' : 'bg-slate-200'} 
          shadow-md transition-colors duration-300 rounded-b-lg`}
      >
        {/* Logo / Title */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-serif text-black dark:text-white">Emo-Diary</h1>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          {/* Fire Icon with Posts Count */}
          <Tooltip
            label={
              loading
                ? 'Loading posts...'
                : error
                ? error
                : `${postsCount} ${postsCount === 1 ? 'Post' : 'Posts'}`
            }
            aria-label="Posts Count Tooltip"
          >
            <div className="flex items-center text-gray-700 dark:text-gray-200 cursor-pointer">
              <FaFire className="text-yellow-500 mr-1" size={20} />
              <span className="text-lg">
                {loading ? '...' : error ? '!' : postsCount}
              </span>
            </div>
          </Tooltip>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Account Image */}
          <AccountImage />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
