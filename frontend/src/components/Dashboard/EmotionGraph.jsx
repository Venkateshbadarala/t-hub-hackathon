// src/components/EmotionalGraph.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { auth, db } from '../../firebase-config';
import { collection, getDocs, query } from 'firebase/firestore';

const EmotionalGraph = () => {
  const [emotionsData, setEmotionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping emotions to numerical values
  const emotionMapping = {
    joy: 3,
    neutral: 2,
    sadness: 1,
    angry: 0,
  };

  // Reverse mapping for labels
  const reverseEmotionMapping = {
    3: 'joy',
    2: 'neutral',
    1: 'sadness',
    0: 'angry',
  };

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }

        const diaryCollectionRef = collection(db, 'users', user.uid, 'diaries');
        const q = query(diaryCollectionRef);
        const querySnapshot = await getDocs(q);

        const fetchedEmotions = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            date: data.date
              ? new Date(data.date).toISOString().split('T')[0]
              : 'Unknown',
            emotion: data.emotion,
          };
        });

        console.log('Fetched Emotions:', fetchedEmotions);

        const transformedData = fetchedEmotions
          .map(entry => {
            if (!entry.emotion) {
              console.warn(`Diary ID ${entry.id} is missing the 'emotion' field.`);
              return null; 
            }

            const emotionLower = entry.emotion.toLowerCase();
            const emotionValue = emotionMapping[emotionLower];

            if (emotionValue === undefined) {
              console.warn(`Diary ID ${entry.id} has an unrecognized emotion: '${entry.emotion}'. Defaulting to 'Neutral'.`);
              return {
                date: entry.date,
                emotionValue: emotionMapping['neutral'],
              };
            }

            console.log(`Mapping Emotion: ${entry.emotion} -> ${emotionValue}`); // Debugging
            return {
              date: entry.date,
              emotionValue: emotionValue,
            };
          })
          .filter(entry => entry !== null) // Remove null entries
          .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

        console.log('Transformed Data for Graph:', transformedData); // Debugging

        setEmotionsData(transformedData);
      } catch (err) {
        console.error('Error fetching emotions:', err.message);
        setError('Failed to fetch emotions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  return (
    <Box w="400px" h="300px" mt={8} p={2} bg="white" rounded="md" shadow="md">
      <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={2}>
        Emotion Over Time
      </Text>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
          <Spinner size="md" />
        </Box>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : emotionsData.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No emotions to display.
        </Text>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={emotionsData}
            margin={{
              top: 10, right: 10, left: 10, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              label={{ angle: -90, position: 'insideLeft' }}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(tick) => reverseEmotionMapping[tick] || 'Unknown'}
            />
            <Tooltip
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value) => reverseEmotionMapping[value] || 'Unknown'}
            />
            <Legend />
            <Line type="monotone" dataKey="emotionValue" name="Emotion" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default EmotionalGraph;
