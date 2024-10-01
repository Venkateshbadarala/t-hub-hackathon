import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase-config';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal'; 
import { FaEdit, FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

const ViewDiaries = ({ selectedDate }) => {
  const [diaries, setDiaries] = useState([]);
  const [allDiaries, setAllDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null); 
  const [editMode, setEditMode] = useState(false); 
  const [editDiary, setEditDiary] = useState({ title: '', content: '' }); 
  const user = auth.currentUser;

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.email);
          const diaryCollectionRef = collection(userDocRef, 'diaries');
          const q = query(diaryCollectionRef);
          const querySnapshot = await getDocs(q);
          
          const fetchedDiaries = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            date: new Date(doc.data().date),
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

  const filteredDiaries = selectedDate
    ? allDiaries.filter((diary) => {
        const diaryDate = new Date(diary.date);
        return (
          diaryDate.getFullYear() === selectedDate.getFullYear() &&
          diaryDate.getMonth() === selectedDate.getMonth() &&
          diaryDate.getDate() === selectedDate.getDate()
        );
      })
    : allDiaries;

  const handleCardClick = (diary) => {
    setSelectedDiary(diary);
  };

  const closeModal = () => {
    setSelectedDiary(null);
    setEditMode(false);
  };

  const handleEditClick = (diary) => {
    setEditDiary({ title: diary.title, content: diary.content });
    setEditMode(true);
    setSelectedDiary(diary);
  };

  const handleSaveEdit = async () => {
    if (!selectedDiary) return;

    try {
      const userDocRef = doc(db, 'users', user.email);
      const diaryDocRef = doc(userDocRef, 'diaries', selectedDiary.id);

      await updateDoc(diaryDocRef, {
        title: editDiary.title,
        content: editDiary.content,
        imageUrl: selectedDiary.imageUrl || null,
        audioUrl: selectedDiary.audioUrl || null,
      });

      const updatedDiaries = allDiaries.map((diary) =>
        diary.id === selectedDiary.id
          ? { ...diary, title: editDiary.title, content: editDiary.content }
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
    const updatedLikesCount = updatedLike ? (diary.likes || 0) + 1 : (diary.likes || 0) - 1;

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

  const handleRemoveMedia = (mediaType) => {
    if (mediaType === 'image') {
      setSelectedDiary((prev) => ({ ...prev, imageUrl: null }));
    } else if (mediaType === 'audio') {
      setSelectedDiary((prev) => ({ ...prev, audioUrl: null }));
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">E-Diary</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDiaries.length > 0 ? (
          filteredDiaries.map((diary) => (
            <div
              key={diary.id}
              className="p-4 transition-transform transform bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:scale-105"
              onClick={() => handleCardClick(diary)}
            >
              <h3 className="text-2xl font-semibold text-blue-600">{diary.title}</h3>
              <p className="text-gray-500">{diary.date.toDateString()}</p>

              {diary.imageUrl && (
                <img
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(diary);
                  }}
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeClick(diary);
                  }}
                  className={`${
                    diary.liked ? 'text-red-500' : 'text-gray-500'
                  } hover:text-red-700 flex items-center`}
                >
                  {diary.liked ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                  {diary.likes ? `(${diary.likes})` : ''}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No diaries found for the selected date.</p>
        )}
      </div>

      {selectedDiary && (
        <Modal
          isOpen={!!selectedDiary}
          onRequestClose={closeModal}
          contentLabel="Diary Details"
          className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-center">
            {editMode ? (
              <input
                type="text"
                value={editDiary.title}
                onChange={(e) =>
                  setEditDiary((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              selectedDiary.title
            )}
          </h2>
          <p className="text-center text-gray-500">{selectedDiary.date.toDateString()}</p>

          {selectedDiary.imageUrl && (
            <div className="relative mt-4">
              <img
                src={selectedDiary.imageUrl}
                alt="diary-img"
                className="object-cover w-full h-64 rounded-lg"
              />
              {editMode && (
                <button
                  onClick={() => handleRemoveMedia('image')}
                  className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          )}
          {selectedDiary.audioUrl && (
            <div className="relative mt-4">
              <audio controls className="w-full">
                <source src={selectedDiary.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              {editMode && (
                <button
                  onClick={() => handleRemoveMedia('audio')}
                  className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          )}
          <div className="mt-4">
            {editMode ? (
              <textarea
                value={editDiary.content}
                onChange={(e) =>
                  setEditDiary((prev) => ({ ...prev, content: e.target.value }))
                }
                rows="5"
                className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p>{selectedDiary.content}</p>
            )}
          </div>

          {editMode ? (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Edit Diary
              </button>
            </div>
          )}

          <button
            onClick={closeModal}
            className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ViewDiaries;
