// ViewDiaries.js
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase-config';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Button, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import DiaryModal from './DiaryModal';
import DiaryList from './DiaryList';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const ViewDiaries = ({ selectedDate }) => {
  const [diaries, setDiaries] = useState([]);
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDiary, setEditDiary] = useState({ title: '', content: '', removeImage: false });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        setLoading(true);
        setError(null);
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
      setDiaries(allDiaries);
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
    }
  }, [showFullHistory, selectedDate, allDiaries]);

  const handleDiaryClick = (diary) => {
    setSelectedDiary(diary);
    setEditMode(false);
    setNewImage(null);
  };

  const handleEditClick = (diary) => {
    setEditDiary({ title: diary.title, content: diary.content, removeImage: false });
    setSelectedDiary(diary);
    setEditMode(true);
    setNewImage(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedDiary) return;

    setLoading(true);
    setError(null);
    try {
      const diaryRef = doc(db, 'users', user.email, 'diaries', selectedDiary.id);
      let updatedData = {
        title: editDiary.title,
        content: editDiary.content,
      };

      // Handle image removal
      if (selectedDiary.imageUrl && editDiary.removeImage) {
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
        if (selectedDiary.imageUrl && !editDiary.removeImage) {
          const oldImageRef = ref(storage, selectedDiary.imageUrl);
          await deleteObject(oldImageRef);
        }
      }

      // Update Firestore document
      await updateDoc(diaryRef, updatedData);

      // Update local state
      const updatedDiaries = allDiaries.map((diary) =>
        diary.id === selectedDiary.id
          ? { ...diary, ...updatedData }
          : diary
      );
      setDiaries(updatedDiaries);
      setAllDiaries(updatedDiaries);

      // Close modal and reset states
      closeModal();
    } catch (error) {
      console.error('Error updating diary:', error.message);
      setError('Failed to update diary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async (diary) => {
    if (!user) {
      setError('You must be logged in to like diaries.');
      return;
    }

    const diaryRef = doc(db, 'users', user.email, 'diaries', diary.id);
    const updatedLike = !diary.liked;
    const updatedLikesCount = updatedLike
      ? (diary.likes || 0) + 1
      : (diary.likes || 0) - 1;

    try {
      await updateDoc(diaryRef, { liked: updatedLike, likes: updatedLikesCount });

      // Update local state
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
      // If editing, mark that the user has chosen to replace the image
      setEditDiary((prev) => ({ ...prev, removeImage: false }));
    }
  };

  const handleRemoveImage = () => {
    setEditDiary((prev) => ({ ...prev, removeImage: true }));
    setNewImage(null);
  };

  const closeModal = () => {
    setSelectedDiary(null);
    setEditMode(false);
    setNewImage(null);
    setEditDiary({ title: '', content: '', removeImage: false });
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">E-Diary</h2>

      <div className="flex justify-center mb-6">
        <Button
          colorScheme="teal"
          onClick={() => setShowFullHistory((prev) => !prev)}
        >
          {showFullHistory ? 'View Selected Date' : 'View Full History'}
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-4">
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

      <DiaryList
        diaries={diaries}
        onDiaryClick={handleDiaryClick}
        onEditClick={handleEditClick}
        onLikeClick={handleLikeClick}
      />

      {selectedDiary && (
        <DiaryModal
          isOpen={Boolean(selectedDiary)}
          onClose={closeModal}
          selectedDiary={selectedDiary}
          editMode={editMode}
          editDiary={editDiary}
          setEditDiary={setEditDiary}
          handleSaveEdit={handleSaveEdit}
          handleRemoveImage={handleRemoveImage}
          newImage={newImage}
          handleImageChange={handleImageChange}
        />
      )}
    </div>
  );
};

export default ViewDiaries;
