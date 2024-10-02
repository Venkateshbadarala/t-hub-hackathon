// DiaryModal.js
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';

const DiaryModal = ({ diary, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent
        borderRadius="md"   // Rounded corners
        boxShadow="xl"      // Shadow effect
      >
        <ModalHeader textAlign="center" fontWeight="bold" fontSize="2xl" borderBottomWidth={1}>
          {diary.title}
        </ModalHeader>
        <ModalCloseButton color="red.500" />
        <ModalBody padding={6}>
          <Box 
            borderRadius="md"
            padding={4}
            boxShadow="base" // Subtle shadow for the content box
          >
            {/* Title Section */}
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
              Title:
            </Text>
            <Text fontSize="lg" lineHeight="tall" color="gray.700" mb={4}>
              {diary.title}
            </Text>
            
            {/* Content Section */}
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
              Content:
            </Text>
            <Text fontSize="lg" lineHeight="tall" color="gray.700" mb={4}>
              {diary.content}
            </Text>
            
            {/* Date Section */}
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
              Date:
            </Text>
            <Text fontSize="sm" color="gray.500">
              {diary.date.toLocaleDateString()}
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button 
            colorScheme="blue" 
            onClick={onClose} 
            variant="solid" 
            size="lg" 
            borderRadius="md" 
            paddingX={8}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiaryModal;
