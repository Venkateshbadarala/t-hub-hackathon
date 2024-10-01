import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
  Box,
} from '@chakra-ui/react';

const DiaryModal = ({ diary, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent
        className="transition-all duration-300 transform "
        background='#708090'
        boxShadow="xl"
        
      >
        <ModalHeader
          color="white"
          fontSize="2xl"
          textAlign="center"
          fontWeight="bold"
         
          py={4}
       
        >
          Diary Entry
        </ModalHeader>

        <ModalBody p={6} bg="white" >
          {/* Title */}
          <Box mb={2}>
            <Text fontWeight="bold" fontSize="md" color="gray.600">
              Title:
            </Text>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="gray.700"
              textAlign="justify"
            >
              {diary.title}
            </Text>
          </Box>

          {/* Content */}
          <Box mb={4}>
            <Text fontWeight="bold" fontSize="md" color="gray.600">
              Content:
            </Text>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="gray.700"
              textAlign="justify"
            >
              {diary.content}
            </Text>
          </Box>

          {/* Image */}
          {diary.imageUrl && (
            <Image
              src={diary.imageUrl}
              alt={diary.title}
              boxShadow="lg"
              borderRadius="md"
              mb={4}
              className="object-cover w-full h-40"
            />
          )}

          {/* Audio */}
          {diary.audioUrl && (
            <audio controls className="w-full mt-2">
              <source src={diary.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          )}
        </ModalBody>

        <ModalFooter bg="gray.100" borderBottomRadius="lg">
          <Button
            colorScheme="blue"
            size="md"
            onClick={onClose}
            className="transition-transform hover:scale-105"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiaryModal;
