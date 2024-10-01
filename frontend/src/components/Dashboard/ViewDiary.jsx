// ViewDiaries.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase-config';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Button, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import DiaryList from './DiaryList';
import DiaryModal from './DiaryModal'; 
import { motion } from 'framer-motion';

const ViewDiaries = ({ selectedDate }) => {
  const [diaries, setDiaries] = useState([]);
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullHistory, setShowFullHistory] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const diaryCollectionRef = collection(userDocRef, 'diaries');
          const q = query(diaryCollectionRef);
          const querySnapshot = await getDocs(q);

          const fetchedDiaries = querySnapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
            date: new Date(docSnap.data().date),
          }));
          setDiaries(fetchedDiaries);
          setAllDiaries(fetchedDiaries);
        } catch (error) {
          console.error('Error fetching diaries:', error.message);
          setError('Failed to fetch diaries. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDiaries();
  }, [user]);

  useEffect(() => {
    if (showFullHistory) {
      setDiaries(allDiaries);
    } else if (selectedDate) {
      const filtered = allDiaries.filter((diary) => {
        const diaryDate = new Date(diary.date);
        return (
          diaryDate.getFullYear() === selectedDate.getFullYear() &&
          diaryDate.getMonth() === selectedDate.getMonth() &&
          diaryDate.getDate() === selectedDate.getDate()
        );
      });
      setDiaries(filtered);
    } else {
      setDiaries(allDiaries);
    }
  }, [selectedDate, allDiaries, showFullHistory]);

  const handleCardClick = (diary) => {
    setSelectedDiary(diary);
  };

  const handleLikeClick = async (diary) => {
    const userDocRef = doc(db, 'users', user.uid);
    const diaryDocRef = doc(userDocRef, 'diaries', diary.id);

    const updatedLike = diary.liked ? false : true;
    const updatedLikesCount = updatedLike
      ? (diary.likes || 0) + 1
      : (diary.likes || 0) - 1;

    try {
      await updateDoc(diaryDocRef, { liked: updatedLike, likes: updatedLikesCount });

      const updatedDiaries = allDiaries.map((d) =>
        d.id === diary.id ? { ...d, liked: updatedLike, likes: updatedLikesCount } : d
      );
      setDiaries(updatedDiaries);
      setAllDiaries(updatedDiaries);
    } catch (error) {
      console.error('Error liking the diary:', error.message);
      setError('Failed to like the diary. Please try again.');
    }
  };

  return (
    <div className="fixed flex flex-col items-center justify-center p-6 ">
      <h2 className="mb-6 font-serif text-3xl font-extrabold text-center text-white">E-Diaries List</h2>

      <div className="flex justify-center mb-6">
        <motion.div className='flex gap-6'>
          <Button colorScheme="blue" onClick={() => setShowFullHistory(false)} className='font-serif'>
            View Selected Date
          </Button>
          <Button colorScheme="blue" onClick={() => setShowFullHistory(true)} className='font-serif'>
            View Full History
          </Button>
        </motion.div>
      </div>

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

      <DiaryList diaries={diaries} onCardClick={handleCardClick} onLikeClick={handleLikeClick} />

      {selectedDiary && (
        <DiaryModal diary={selectedDiary} isOpen={Boolean(selectedDiary)} onClose={() => setSelectedDiary(null)} />
      )}
    </div>
  );
};

export default ViewDiaries;
