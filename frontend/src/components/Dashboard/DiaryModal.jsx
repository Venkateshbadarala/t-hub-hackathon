import React, { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Image,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { RxCross2 } from 'react-icons/rx';
import { FaImage } from 'react-icons/fa';
import { MdOutlineAudiotrack } from 'react-icons/md';

const DiaryModal = ({
  isOpen,
  diary,
  editMode,
  editDiary,
  setEditDiary,
  newImage,
  handleImageChange,
  handleRemoveImage,
  closeModal,
  handleSaveEdit,
}) => {
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <h1 className='font-bold text-center'>Edit Your Content</h1>
          {editMode ? (
            <Input
              value={editDiary.title}
              onChange={(e) =>
                setEditDiary((prev) => ({ ...prev, title: e.target.value }))
              }
              variant='flushed'
              placeholder='Title'
            />
          ) : (
            diary.title
          )}
        </ModalHeader>
        <ModalBody>
          {editMode ? (
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              {diary.imageUrl && !newImage && !editDiary.removeImage && (
                <div className='relative flex items-center mb-2'>
                  <Image
                    src={diary.imageUrl}
                    alt='Current Image'
                    boxSize='100px'
                    objectFit='cover'
                    mr={4}
                    className='rounded-lg'
                  />
                  <Button
                    onClick={handleRemoveImage}
                    className='absolute p-1 bg-red-500 rounded-full top-1 right-1'
                    aria-label='Remove Image'
                  >
                    <RxCross2 className='text-red-500' />
                  </Button>
                </div>
              )}
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <input
                    type='file'
                    accept='image/*'
                    className='hidden'
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={() => imageInputRef.current.click()}
                    className='p-2 bg-gray-200 rounded-md hover:bg-gray-300'
                  >
                    <FaImage size={24} />
                  </button>
                  <span className='text-sm'></span>
                </div>
                <div className='relative'>
                  <input
                    type='file'
                    accept='audio/*'
                    className='hidden'
                    ref={audioInputRef}
                    onChange={(e) => setEditDiary((prev) => ({ ...prev, audio: e.target.files[0] }))}
                  />
                  <button
                    onClick={() => audioInputRef.current.click()}
                    className='p-2 bg-gray-200 rounded-md hover:bg-gray-300'
                  >
                    <MdOutlineAudiotrack size={24} />
                  </button>
                  <span className='text-sm'></span>
                </div>
              </div>
            </FormControl>
          ) : (
            diary.imageUrl && (
              <div className='relative'>
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
          <div className='flex items-center justify-between w-full'>
            <p className='text-center text-gray-500'>{diary.date.toDateString()}</p>
            <div>
              {editMode ? (
                <>
                  <Button colorScheme='blue' mr={3} onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button variant='ghost' onClick={closeModal}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button colorScheme='blue' onClick={closeModal}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiaryModal;
