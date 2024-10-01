import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase-config';
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
  // Input,
  // Textarea,
  Image,
  FormControl,
  FormLabel,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Removed FaEdit
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const ViewDiaries = ({ selectedDate }) => {
  const [diaries, setDiaries] = useState([]);
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  // const [editMode, setEditMode] = useState(false);
  // const [editDiary, setEditDiary] = useState({ title: '', content: '' });
  // const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullHistory, setShowFullHistory] = useState(false); // Toggle for history view
  const user = auth.currentUser;

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          const userDocRef = doc(db, 'users', user.uid);
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
          setError('Failed to fetch diaries. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDiaries();
  }, [user]);

  // Logic to filter by selected date or display full history
  useEffect(() => {
    if (showFullHistory) {
      setDiaries(allDiaries); // Show full history
    } else if (selectedDate) {
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
      setDiaries(allDiaries); // Default to all if no date is selected
    }
  }, [selectedDate, allDiaries, showFullHistory]);

  const handleCardClick = (diary) => {
    setSelectedDiary(diary);
    // setEditMode(false);
    // setNewImage(null);
  };

  const closeModal = () => {
    setSelectedDiary(null);
    // setEditMode(false);
    // setNewImage(null);
  };

  // Comment out the handleEditClick function
  // const handleEditClick = (diary) => {
  //   setEditDiary({ title: diary.title, content: diary.content });
  //   setEditMode(true);
  //   setSelectedDiary(diary);
  //   setNewImage(null);
  // };

  // Comment out the handleSaveEdit function
  // const handleSaveEdit = async () => {
  //   if (!selectedDiary) return;

  //   try {
  //     const userDocRef = doc(db, 'users', user.email);
  //     const diaryDocRef = doc(userDocRef, 'diaries', selectedDiary.id);

  //     let updatedData = {
  //       title: editDiary.title,
  //       content: editDiary.content,
  //     };

  //     if (selectedDiary.imageUrl && !newImage && editDiary.removeImage) {
  //       const imageRef = ref(storage, selectedDiary.imageUrl);
  //       await deleteObject(imageRef);
  //       updatedData.imageUrl = null;
  //     }

  //     if (newImage) {
  //       const imageRef = ref(storage, `users/${user.email}/diaries/${selectedDiary.id}/${newImage.name}`);
  //       const snapshot = await uploadBytes(imageRef, newImage);
  //       const downloadURL = await getDownloadURL(snapshot.ref);
  //       updatedData.imageUrl = downloadURL;

  //       if (selectedDiary.imageUrl) {
  //         const oldImageRef = ref(storage, selectedDiary.imageUrl);
  //         await deleteObject(oldImageRef);
  //       }
  //     }

  //     updatedData.imageUrl = updatedData.imageUrl !== undefined ? updatedData.imageUrl : selectedDiary.imageUrl;
  //     updatedData.audioUrl = selectedDiary.audioUrl || null;

  //     await updateDoc(diaryDocRef, updatedData);

  //     const updatedDiaries = allDiaries.map((diary) =>
  //       diary.id === selectedDiary.id
  //         ? { ...diary, ...updatedData }
  //         : diary
  //     );
  //     setDiaries(updatedDiaries);
  //     setAllDiaries(updatedDiaries);

  //     closeModal();
  //   } catch (error) {
  //     console.error('Error updating diary:', error.message);
  //     setError('Failed to update diary. Please try again.');
  //   }
  // };

  const handleLikeClick = async (diary) => {
    const userDocRef = doc(db, 'users', user.uid);
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
      setError('Failed to like the diary. Please try again.');
    }
  };

  // Comment out the handleImageChange and handleRemoveImage functions
  // const handleImageChange = (e) => {
  //   if (e.target.files[0]) {
  //     setNewImage(e.target.files[0]);
  //     setEditDiary((prev) => ({ ...prev, removeImage: false }));
  //   }
  // };

  // const handleRemoveImage = () => {
  //   setEditDiary((prev) => ({ ...prev, removeImage: true }));
  //   setNewImage(null);
  // };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">E-Diary</h2>

      <div className="flex justify-center mb-6">
        <Button
          colorScheme="teal"
          onClick={() => setShowFullHistory(!showFullHistory)}
        >
          {showFullHistory ? 'View Selected Date' : 'View Full History'}
        </Button>
      </div>

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
              <Text className="mt-4 text-gray-700 truncate">{diary.content}</Text>

              <div className="flex justify-between mt-4">
                {/* Removed edit button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeClick(diary);
                  }}
                  colorScheme={diary.liked ? 'red' : 'gray'}
                  leftIcon={diary.liked ? <FaHeart /> : <FaRegHeart />}
                >
                  {diary.likes || 0}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No diary entries available.</p>
        )}
      </div>

      {selectedDiary && (
        <Modal isOpen={Boolean(selectedDiary)} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedDiary.title}</ModalHeader>
            <ModalBody>
              <Text>{selectedDiary.content}</Text>
              {selectedDiary.imageUrl && (
                <Image
                  src={selectedDiary.imageUrl}
                  alt={selectedDiary.title}
                  className="object-cover w-full h-40 mt-2 rounded-lg"
                />
              )}
              {selectedDiary.audioUrl && (
                <audio controls className="w-full mt-2">
                  <source src={selectedDiary.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default ViewDiaries;
