// DiaryList.js
import React from 'react';
import DiaryCard from './DiaryCard';

const DiaryList = ({ diaries, onDiaryClick, onEditClick, onLikeClick }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {diaries.length > 0 ? (
        diaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            onClick={() => onDiaryClick(diary)}
            onEditClick={onEditClick}
            onLikeClick={onLikeClick}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No diary entries available.</p>
      )}
    </div>
  );
};

export default DiaryList;
