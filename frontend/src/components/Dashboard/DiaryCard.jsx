import React from 'react';
import { Image, Button, Text, Box, useBreakpointValue } from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { FaStarHalfStroke } from 'react-icons/fa6';

const DiaryCard = ({ diary, onCardClick, onLikeClick }) => {
  return (
    <Box
      className="transition-transform transform bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 w-[20rem]  mx-auto"
      p={4}
      onClick={() => onCardClick(diary)}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
    >
      <Text
        fontFamily="serif"
        fontSize={useBreakpointValue({ base: 'xl', md: '2xl' })}
        fontWeight="bold"
        color="blue.600"
        mb={2}
      >
        {diary.title}
      </Text>

      {diary.imageUrl && (
        <Image
          src={diary.imageUrl}
          alt={diary.title}
          className="object-cover w-full h-40 mb-2 rounded-lg"
          borderRadius="md"
        />
      )}

      {diary.audioUrl && (
        <audio controls className="w-full mb-2 rounded-md">
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

      <Box className="flex items-center justify-between mt-4">
        <Text className="font-semibold text-gray-500">{diary.date.toDateString()}</Text>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onLikeClick(diary);
          }}
          colorScheme={diary.liked ? 'red' : 'gray'}
          leftIcon={diary.liked ? <FaStar/> : <FaStarHalfStroke />}
          borderRadius="full"
          variant="outline"
          _hover={{ bg: diary.liked ? 'red.100' : 'gray.100' }}
          className="flex items-center justify-center text-center"
        >
       
        </Button>
      </Box>
    </Box>
  );
};

export default DiaryCard;
