import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase-config';
import { query, getDocs, doc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import DiaryList from './DiaryList';
import DiaryModal from './DiaryModal';

const ViewDiaries = ({ selectedDate }) => {
  const [diaries, setDiaries] = useState([]);
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDiary, setEditDiary] = useState({ title: '', content: '' });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    if (selectedDate) {
      const filteredDiaries = allDiaries.filter(
        (diary) =>
          diary.date.getDate() === selectedDate.getDate() &&
          diary.date.getMonth() === selectedDate.getMonth() &&
          diary.date.getFullYear() === selectedDate.getFullYear()
      );
      setDiaries(filteredDiaries);
    } else {
      setDiaries(allDiaries);
    }
  }, [selectedDate, allDiaries]);

  const handleCardClick = (diary) => {
    setSelectedDiary(diary);
    setEditMode(false);
    setNewImage(null);
  };

  const handleEditClick = (diary) => {
    setSelectedDiary(diary);
    setEditDiary({ title: diary.title, content: diary.content });
    setEditMode(true);
  };

  const handleLikeClick = async (diary) => {
    try {
      const userDocRef = doc(db, 'users', user.email);
      const diaryRef = doc(userDocRef, 'diaries', diary.id);
      const updatedDiary = { liked: !diary.liked, likes: diary.liked ? diary.likes - 1 : diary.likes + 1 };

      await updateDoc(diaryRef, updatedDiary);
      setDiaries((prev) =>
        prev.map((d) =>
          d.id === diary.id ? { ...d, liked: updatedDiary.liked, likes: updatedDiary.likes } : d
        )
      );
    } catch (error) {
      console.error('Error updating diary:', error.message);
      setError('Failed to update diary. Please try again later.');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedDiary) return;

    const userDocRef = doc(db, 'users', user.email);
    const diaryRef = doc(userDocRef, 'diaries', selectedDiary.id);

    const updatedDiary = {
      ...editDiary,
      imageUrl: selectedDiary.imageUrl,
    };

    if (newImage) {
      try {
        const imageRef = ref(storage, `diary-images/${user.uid}/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        const downloadURL = await getDownloadURL(imageRef);
        updatedDiary.imageUrl = downloadURL;

        if (selectedDiary.imageUrl) {
          const previousImageRef = ref(storage, selectedDiary.imageUrl);
          await deleteObject(previousImageRef);
        }
      } catch (error) {
        console.error('Error uploading new image:', error.message);
        setError('Failed to upload image. Please try again later.');
        return;
      }
    }

    try {
      await updateDoc(diaryRef, updatedDiary);
      setDiaries((prev) =>
        prev.map((d) => (d.id === selectedDiary.id ? { ...d, ...updatedDiary } : d))
      );
      setSelectedDiary(null);
    } catch (error) {
      console.error('Error updating diary:', error.message);
      setError('Failed to update diary. Please try again later.');
    }
  };

  const closeModal = () => {
    setSelectedDiary(null);
    setEditMode(false);
    setNewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleRemoveImage = () => {
    setEditDiary((prev) => ({ ...prev, removeImage: true }));
  };

  return (
    <>
      <DiaryList
        diaries={diaries}
        loading={loading}
        error={error}
        handleCardClick={handleCardClick}
        handleEditClick={handleEditClick}
        handleLikeClick={handleLikeClick}
      />
      {selectedDiary && (
        <DiaryModal
          isOpen={!!selectedDiary}
          diary={selectedDiary}
          editMode={editMode}
          editDiary={editDiary}
          setEditDiary={setEditDiary}
          newImage={newImage}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          closeModal={closeModal}
          handleSaveEdit={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ViewDiaries;
