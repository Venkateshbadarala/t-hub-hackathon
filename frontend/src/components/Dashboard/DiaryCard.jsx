import React from 'react';
import { Image, Button, Text } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const DiaryCard = ({ diary, onCardClick, onLikeClick }) => {
  return (
    <div
      className="p-4 transition-transform transform bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:scale-105 w-[20rem]"
      onClick={() => onCardClick(diary)}
    >
      <h3 className="font-serif text-2xl font-semibold text-blue-600">{diary.title}</h3>

      {diary.imageUrl && (
        <Image
          src={diary.imageUrl}
          alt={diary.title}
          className="object-cover w-full h-40 mt-2 rounded-lg"
        />
      )}
      {diary.audioUrl && (
        <audio controls className="w-full mt-2">
          <source src={diary.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}

      {/* Truncate content to show only two lines */}
      <Text
        className="mt-4 overflow-hidden text-gray-700"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {diary.content}
      </Text>

      <div className="flex justify-between mt-4">
        <p className="font-semibold text-gray-500">{diary.date.toDateString()}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onLikeClick(diary);
          }}
          colorScheme={diary.liked ? 'red' : 'gray'}
          leftIcon={diary.liked ? <FaHeart /> : <FaRegHeart />}
          className='flex items-center justify-center text-center'
        />
          
        
      </div>
    </div>
  );
};

export default DiaryCard;
