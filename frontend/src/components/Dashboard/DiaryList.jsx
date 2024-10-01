import React from 'react';
import { Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, Text } from '@chakra-ui/react';
import DiaryCard from './DiaryCard';

const DiaryList = ({ diaries, loading, error, handleCardClick, handleEditClick, handleLikeClick }) => {
  return (
    <>
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {diaries.length > 0 ? (
          diaries.map((diary) => (
            <DiaryCard
              key={diary.id}
              diary={diary}
              onClick={() => handleCardClick(diary)}
              onEditClick={() => handleEditClick(diary)}
              onLikeClick={() => handleLikeClick(diary)}
            />
          ))
        ) : (
          <Text textAlign="center" color="gray.500">No diaries found for the selected date.</Text>
        )}
      </div>
    </>
  );
};

export default DiaryList;
