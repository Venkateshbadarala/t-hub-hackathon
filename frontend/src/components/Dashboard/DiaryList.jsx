// DiaryList.js
import React from 'react';
import DiaryCard from './DiaryCard';

const DiaryList = ({ diaries, onCardClick, onLikeClick }) => {
  return diaries.length > 0 ? (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {diaries.map((diary) => (
        <DiaryCard
          key={diary.id}
          diary={diary}
          onCardClick={onCardClick}
          onLikeClick={onLikeClick}
        />
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500">No diary entries available.</p>
  );
};

export default DiaryList;
