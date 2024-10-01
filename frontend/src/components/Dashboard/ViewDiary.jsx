import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase-config'; // Ensure storage is imported
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
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
import { FaEdit, FaHeart, FaRegHeart } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Import necessary storage functions

const ViewDiaries = ({ selectedDate }) => {
  const [ setDiaries] = useState([]);
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDiary, setEditDiary] = useState({ title: '', content: '' });
  const [newImage, setNewImage] = useState(null); // State for new image file
  const user = auth.currentUser;

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.email);
          const diaryCollectionRef = collection(userDocRef, 'diaries');
          const q = query(diaryCollectionRef);
          const querySnapshot = await getDocs(q);

          const fetchedDiaries = querySnapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
            date: new Date(docSnap.data().date),
          }));
          setDiaries(fetchedDiaries);
          setAllDiaries(fetchedDiaries);
        } catch (error) {
          console.error('Error fetching diaries:', error.message);
        }
      }
    };

    fetchDiaries();
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = allDiaries.filter((diary) => {
        const diaryDate = new Date(diary.date);
        return (
          diaryDate.getFullYear() === selectedDate.getFullYear() &&
          diaryDate.getMonth() === selectedDate.getMonth() &&
          diaryDate.getDate() === selectedDate.getDate()
        );
      });
      setDiaries(filtered);
    } else {
      setDiaries(allDiaries);
    }
  }, [selectedDate, allDiaries]);

  const handleCardClick = (diary) => {
    setSelectedDiary(diary);
    setEditMode(false); // Ensure edit mode is off when viewing
    setNewImage(null); // Reset new image
  };

  const closeModal = () => {
    setSelectedDiary(null);
    setEditMode(false);
    setNewImage(null); // Reset new image
  };

  const handleEditClick = (diary) => {
    setEditDiary({ title: diary.title, content: diary.content });
    setEditMode(true);
    setSelectedDiary(diary);
    setNewImage(null); // Reset new image
  };

  const handleSaveEdit = async () => {
    if (!selectedDiary) return;

    try {
      const userDocRef = doc(db, 'users', user.email);
      const diaryDocRef = doc(userDocRef, 'diaries', selectedDiary.id);

      let updatedData = {
        title: editDiary.title,
        content: editDiary.content,
      };

      // Handle image removal
      if (selectedDiary.imageUrl && !newImage && editDiary.removeImage) {
        // Delete the existing image from storage
        const imageRef = ref(storage, selectedDiary.imageUrl);
        await deleteObject(imageRef);
        updatedData.imageUrl = null;
      }

      // Handle new image upload
      if (newImage) {
        const imageRef = ref(storage, `users/${user.email}/diaries/${selectedDiary.id}/${newImage.name}`);
        const snapshot = await uploadBytes(imageRef, newImage);
        const downloadURL = await getDownloadURL(snapshot.ref);
        updatedData.imageUrl = downloadURL;

        // If replacing an existing image, delete the old one
        if (selectedDiary.imageUrl) {
          const oldImageRef = ref(storage, selectedDiary.imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      // Update other fields if needed (e.g., audioUrl)
      updatedData.imageUrl = updatedData.imageUrl !== undefined ? updatedData.imageUrl : selectedDiary.imageUrl;
      updatedData.audioUrl = selectedDiary.audioUrl || null;

      await updateDoc(diaryDocRef, updatedData);

      const updatedDiaries = allDiaries.map((diary) =>
        diary.id === selectedDiary.id
          ? { ...diary, ...updatedData }
          : diary
      );
      setDiaries(updatedDiaries);
      setAllDiaries(updatedDiaries);

      closeModal();
    } catch (error) {
      console.error('Error updating diary:', error.message);
    }
  };

  const handleLikeClick = async (diary) => {
    const userDocRef = doc(db, 'users', user.email);
    const diaryDocRef = doc(userDocRef, 'diaries', diary.id);

    const updatedLike = diary.liked ? false : true;
    const updatedLikesCount = updatedLike
      ? (diary.likes || 0) + 1
      : (diary.likes || 0) - 1;

    try {
      await updateDoc(diaryDocRef, { liked: updatedLike, likes: updatedLikesCount });

      const updatedDiaries = allDiaries.map((d) =>
        d.id === diary.id ? { ...d, liked: updatedLike, likes: updatedLikesCount } : d
      );
      setDiaries(updatedDiaries);
      setAllDiaries(updatedDiaries);
    } catch (error) {
      console.error('Error liking the diary:', error.message);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setEditDiary((prev) => ({ ...prev, removeImage: true }));
    setNewImage(null);
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">E-Diary</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {diaries.length > 0 ? (
          diaries.map((diary) => (
            <div
              key={diary.id}
              className="p-4 transition-transform transform bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:scale-105"
              onClick={() => handleCardClick(diary)}
            >
              <h3 className="text-2xl font-semibold text-blue-600">{diary.title}</h3>
              <p className="text-gray-500">{diary.date.toDateString()}</p>

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
              <p className="mt-4 text-gray-700 truncate">{diary.content}</p>

              <div className="flex justify-between mt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(diary);
                  }}
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<FaEdit />}
                >
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeClick(diary);
                  }}
                  colorScheme={diary.liked ? 'red' : 'gray'}
                  variant="outline"
                  leftIcon={diary.liked ? <FaHeart /> : <FaRegHeart />}
                >
                  {diary.liked ? 'Unlike' : 'Like'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Text textAlign="center" color="gray.500">No diaries found for the selected date.</Text>
        )}
      </div>

      {selectedDiary && (
        <Modal isOpen={!!selectedDiary} onClose={closeModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editMode ? (
                <Input
                  value={editDiary.title}
                  onChange={(e) =>
                    setEditDiary((prev) => ({ ...prev, title: e.target.value }))
                  }
                  variant="flushed"
                  placeholder="Title"
                />
              ) : (
                selectedDiary.title
              )}
            </ModalHeader>
            <ModalBody>
              <Text textAlign="center" color="gray.500">{selectedDiary.date.toDateString()}</Text>

              {selectedDiary.imageUrl && !editMode && (
                <Image
                  src={selectedDiary.imageUrl}
                  alt={selectedDiary.title}
                  className="object-cover w-full h-40 mt-2 rounded-lg"
                />
              )}

              {editMode && (
                <FormControl mt={4}>
                  <FormLabel>Image</FormLabel>
                  {selectedDiary.imageUrl && !newImage && !editDiary.removeImage && (
                    <div className="flex items-center mb-2">
                      <Image
                        src={selectedDiary.imageUrl}
                        alt="Current Image"
                        boxSize="100px"
                        objectFit="cover"
                        mr={4}
                      />
                      <Button colorScheme="red" onClick={handleRemoveImage}>
                        Remove Image
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {newImage && (
                    <Image
                      src={URL.createObjectURL(newImage)}
                      alt="New Image Preview"
                      boxSize="100px"
                      objectFit="cover"
                      mt={2}
                    />
                  )}
                </FormControl>
              )}

              {selectedDiary.audioUrl && (
                <audio controls className="w-full mt-2">
                  <source src={selectedDiary.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              )}
              <FormControl mt={4}>
                <FormLabel>Content</FormLabel>
                <Textarea
                  value={editMode ? editDiary.content : selectedDiary.content}
                  onChange={(e) =>
                    setEditDiary((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Content"
                  size="lg"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {editMode ? (
                <>
                  <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                </>
              ) : (
                <Button colorScheme="blue" onClick={closeModal}>
                  Close
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default ViewDiaries;
