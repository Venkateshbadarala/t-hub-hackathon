import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Use `useNavigate` for navigation
import AccountImage from './AccountImage';
import { FaFire, FaHeart, FaStar } from 'react-icons/fa';
import { auth, db } from '../../firebase-config';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Tooltip } from '@chakra-ui/react';
import { RiTeamFill } from 'react-icons/ri';
import { IoHomeSharp } from 'react-icons/io5';
import AddDiary from '../Dashboard/AddDiary';
import logo from './e-diarylogo.png';
import { FaUserDoctor } from 'react-icons/fa6';

const NavbarRoutes = [
  {
    id: 1,
    name: 'Home',
    icon: <IoHomeSharp />,
    route: '/dashboard',
  },
  {
    id: 2,
    name: 'Community',
    icon: <RiTeamFill />,
    route: '/community',
  },
  {
    id: 3,
    name: 'Starred',
    icon: <FaStar />,
    route: '/likes',
  },
];

const Navbar = () => {
  const navigate = useNavigate(); // Initialize navigation
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [allDiaries, setAllDiaries] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track user authentication status
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

  // Fetch user's diaries from Firebase Firestore
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

  // Detect scroll and show/hide the navbar based on scroll direction
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
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 text-white bg-black shadow-lg"
    >
      <div className="flex items-center justify-between px-8 py-3">
        <img src={logo} alt="logo" className='w-[10rem]' />

        {/* Navigation Links */}
        <nav className="flex space-x-8">
          {NavbarRoutes.map((route) => (
            <Link
              key={route.id}
              to={route.route}
              className="flex items-center font-bold transition duration-300 hover:text-indigo-300 text-[18px]"
            >
              <span className="mr-2">{route.icon}</span>
              <span>{route.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section: AddDiary, Posts Count, and Account */}
        <div className="flex items-center space-x-6">
          <AddDiary />
          
          {/* Doctor Appointment Button */}
          <button onClick={() => navigate('/doctor-booking')} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-indigo-800">
            <FaUserDoctor size={20} />
            <span>Book Appointment</span>
          </button>

          <Tooltip
            label={
              loading
                ? 'Loading posts...'
                : error
                ? error
                : `${postsCount} ${postsCount === 1 ? 'Point' : 'Points'}`
            }
            aria-label="Posts Count Tooltip"
          >
            <div className="flex items-center text-white cursor-pointer">
              <FaFire className="mr-1 text-yellow-500" size={20} />
              <span className="text-lg">
                {loading ? '...' : error ? '!' : postsCount}
              </span>
            </div>
          </Tooltip>

          {/* User Account Image */}
          <AccountImage />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
