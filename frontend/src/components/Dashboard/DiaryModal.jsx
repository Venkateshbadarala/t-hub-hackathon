import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Input,
  Textarea,
  Image,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const DiaryModal = ({
  isOpen,
  onClose,
  selectedDiary,
  editMode,
  editDiary,
  setEditDiary,
  handleSaveEdit,
  handleRemoveImage,
  newImage,
  handleImageChange,
  handleLikeClick, // Include handleLikeClick in props
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editMode ? 'Edit Diary' : selectedDiary.title}</ModalHeader>
        <ModalBody>
          {editMode ? (
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={editDiary.title}
                onChange={(e) =>
                  setEditDiary((prev) => ({ ...prev, title: e.target.value }))
                }
                mb={4}
              />
              <FormLabel>Content</FormLabel>
              <Textarea
                value={editDiary.content}
                onChange={(e) =>
                  setEditDiary((prev) => ({ ...prev, content: e.target.value }))
                }
                mb={4}
              />
              <FormLabel>Image</FormLabel>
              {selectedDiary.imageUrl && !editDiary.removeImage && (
                <Image
                  src={selectedDiary.imageUrl}
                  alt="Current Image"
                  className="object-cover w-full h-40 mt-2 rounded-lg"
                  mb={4}
                />
              )}
              {newImage ? (
                <p>{newImage.name}</p>
              ) : (
                <>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {selectedDiary.imageUrl && !editDiary.removeImage && (
                    <Button
                      colorScheme="red"
                      variant="outline"
                      mt={2}
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  )}
                </>
              )}
            </FormControl>
          ) : (
            <>
              <Text>{selectedDiary.content}</Text>
              {selectedDiary.imageUrl && (
                <Image
                  src={diary.imageUrl}
                  alt={diary.title}
                  className='object-cover w-full h-40 mt-2 rounded-lg'
                />
              </div>
            )
          )}

          <FormControl mt={4}>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={editMode ? editDiary.content : diary.content}
              onChange={(e) =>
                setEditDiary((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder='Content'
              size='lg'
              isReadOnly={!editMode}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          {editMode ? (
            <>
              <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                colorScheme={selectedDiary.liked ? 'red' : 'gray'}
                variant="outline"
                onClick={() => handleLikeClick(selectedDiary)} 
                mr={3}
              >
                {selectedDiary.liked ? 'Unlike' : 'Like'}
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Edit
              </Button>
            </>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiaryModal;
