// Like.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase-config';
import { collection, query, getDocs, where, doc } from 'firebase/firestore';
import { Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import DiaryList from './DiaryList';
import DiaryModal from './DiaryModal';
import Navbar from '../Navbar/Navbar';

const Like = () => {
  const [likedDiaries, setLikedDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchLikedDiaries = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const diaryCollectionRef = collection(userDocRef, 'diaries');
          const q = query(diaryCollectionRef, where('liked', '==', true));
          const querySnapshot = await getDocs(q);
          const fetchedLikedDiaries = querySnapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
            date: new Date(docSnap.data().date),
          }));

          setLikedDiaries(fetchedLikedDiaries);
        } catch (error) {
          console.error('Error fetching liked diaries:', error.message);
          setError('Failed to fetch liked diaries. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLikedDiaries();
  }, [user]);

  const handleCardClick = (diary) => {
    setSelectedDiary(diary);
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl p-6 mx-auto pt-[8%]">
      <h2 className="mb-6 text-3xl font-bold text-center text-white">Liked Diaries</h2>

      {loading && (
        <div className="flex items-center justify-center my-4">
          <Spinner size="xl" />
        </div>
      )}

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {likedDiaries.length > 0 ? (
        <DiaryList diaries={likedDiaries} onCardClick={handleCardClick} />
      ) : (
        <p className="text-center text-white">No liked diaries found.</p>
      )}

      {selectedDiary && (
        <DiaryModal diary={selectedDiary} isOpen={Boolean(selectedDiary)} onClose={() => setSelectedDiary(null)} />
      )}
    </div>
    </>
  );
};

export default Like;
