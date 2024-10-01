import React, { useEffect, useState } from 'react';
import { useHistoryContext } from '../../context/useHistory'; 
import { auth, db } from '../../firebase-config';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Spinner, Box, Text, Heading } from '@chakra-ui/react';

const History = () => {
  const { showFullHistory } = useHistoryContext(); 
  const [diaries, setDiaries] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes to get the user's email
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
        setDiaries([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch diaries based on whether showFullHistory is true or false
  useEffect(() => {
    if (!userEmail) return;

    const diariesRef = collection(db, 'users', userEmail, 'diaries');
    const q = query(diariesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allDiaries = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
          date: new Date(docSnap.data().date),
        }));

        if (showFullHistory) {
          setDiaries(allDiaries); // Show all diaries if toggled on
        } else {
          // Show selected diaries, e.g., filter by a date range (example logic)
          const today = new Date();
          const recentDiaries = allDiaries.filter(
            (diary) => diary.date >= new Date(today.setDate(today.getDate() - 7))
          );
          setDiaries(recentDiaries);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching diaries:', err);
        setError('Failed to load diaries.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userEmail, showFullHistory]);

  if (loading) {
    return (
      <Box textAlign="center" my="6">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500" textAlign="center">{error}</Text>;
  }

  return (
    <Box p="6">
      <Heading as="h2" size="lg" mb="4" textAlign="center">
        {showFullHistory ? 'Full History of Diaries' : 'Recent Diaries'}
      </Heading>

      {diaries.length === 0 ? (
        <Text textAlign="center">No diaries available.</Text>
      ) : (
        diaries.map((diary) => (
          <Box
            key={diary.id}
            p="4"
            my="4"
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
          >
            <Heading as="h3" size="md">{diary.title}</Heading>
            <Text mt="2">{diary.content}</Text>
            <Text mt="2" fontSize="sm" color="gray.500">
              {diary.date.toDateString()}
            </Text>
          </Box>
        ))
      )}
    </Box>
  );
};

export default History;
