import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import AccountImage from './AccountImage';
import { FaFire, FaHistory } from 'react-icons/fa';
import { auth, db } from '../../firebase-config';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Tooltip, useColorMode } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useHistoryContext } from '../../context/useHistory'; // Import the correct hook

const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [allDiaries, setAllDiaries] = useState([]);
  const { colorMode } = useColorMode(); // To determine current theme
  const [postsCount, setPostsCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access toggleHistory from the History context
  const { toggleHistory } = useHistoryContext(); 

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setPostsCount(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen for changes in the user's diaries collection
  useEffect(() => {
    if (!userId) {
      setAllDiaries([]);
      setPostsCount(0);
      setLoading(false);
      return;
    }

    const diariesRef = collection(db, 'users', userId, 'diaries');
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
  }, [userId]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined) {
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
        <div className="flex-shrink-0">
          <h1 className="font-serif text-2xl text-black dark:text-white">Emo-Diary</h1>
        </div>

        <div className="flex items-center space-x-6">
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
            <div className="flex items-center text-gray-700 cursor-pointer dark:text-gray-200">
              <FaFire className="mr-1 text-yellow-500" size={20} />
              <span className="text-lg">
                {loading ? '...' : error ? '!' : postsCount}
              </span>
            </div>
          </Tooltip>
          
          <div onClick={toggleHistory} className="cursor-pointer"> 
            <FaHistory size={20} />
          </div>

          <AccountImage />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
