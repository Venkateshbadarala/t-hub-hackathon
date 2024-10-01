import React, { useState, useEffect, useRef } from 'react';
import { auth, db, storage } from '../../firebase-config';
import { doc, collection, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MdOutlineAudiotrack } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { TiDocumentAdd } from "react-icons/ti";

const AddDiary = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  // const [image, setImage] = useState(null);
  // const [audio, setAudio] = useState(null);
  // const [imagePreview, setImagePreview] = useState('');
  // const [audioPreview, setAudioPreview] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [ismodel, setIsmodel] = useState(false);
  const [activity, setActivity] = useState('');
  const [musicRecommendation, setMusicRecommendation] = useState('');
  const [consecutiveNegDays, setConsecutiveNegDays] = useState(0);
  
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // useEffect(() => {
  //   const today = new Date().toISOString().split('T')[0];
  //   setDate(today);
  //   setCurrentDate(today);
  // }, []);

  // useEffect(() => {
  //   if (image) {
  //     setImagePreview(URL.createObjectURL(image));
  //   }
  // }, [image]);

  // useEffect(() => {
  //   if (audio) {
  //     setAudioPreview(URL.createObjectURL(audio));
  //   }
  // }, [audio]);

  const handleAddDiary = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to add a diary entry.');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const diaryCollectionRef = collection(userDocRef, 'diaries');
      // let imageUrl = '';
      // let audioUrl = '';

      // if (image) {
      //   const imageRef = ref(storage, `diaries/${user.uid}/${date}/image`);
      //   const imageSnapshot = await uploadBytes(imageRef, image);
      //   imageUrl = await getDownloadURL(imageSnapshot.ref);
      // }

      // if (audio) {
      //   const audioRef = ref(storage, `diaries/${user.uid}/${date}/audio`);
      //   const audioSnapshot = await uploadBytes(audioRef, audio);
      //   audioUrl = await getDownloadURL(audioSnapshot.ref);
      // }

      const response = await axios.post("http://127.0.0.1:5000/api/analyze-emotion", {
        entry: content,
        userId: user.uid,
      });

      const { emotion, consecutive_neg_days, activity, music } = response.data;

      setActivity(activity);
      setMusicRecommendation(music);
      setConsecutiveNegDays(consecutive_neg_days);

      await setDoc(doc(diaryCollectionRef, date), {
        title,
        content,
        date: new Date(date).toISOString(),
        // imageUrl,
        // audioUrl,
        emotion
      });

      alert(`Diary entry added! Emotion Detected: ${emotion}`);
      resetForm();
    } catch (error) {
      console.error('Error adding diary entry:', error.message);
      alert('Error adding diary entry: ' + error.message);
    }
  };

  const resetForm = () => {
    setContent('');
    setTitle('');
    setDate(currentDate);
    // setImage(null);
    // setAudio(null);
    // setImagePreview('');
    // setAudioPreview('');
    setActivity('');
    setMusicRecommendation('');
    setConsecutiveNegDays(0);
  };

  return (
    <>
      <button onClick={() => setIsmodel(true)} className="flex items-center justify-center gap-2 p-2 text-white bg-blue-500 rounded-md"><TiDocumentAdd /> Add</button>

      {ismodel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-[28rem]">
          <div className="max-w-[60rem] p-6 bg-white rounded-lg shadow-lg relative">
            <button onClick={() => setIsmodel(false)} className="absolute top-4 right-4">
              <RxCross2 size={20} />
            </button>
            <h2 className="mb-4 text-2xl font-bold text-center">Add Diary Entry</h2>

            <div className="flex flex-col items-center gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={currentDate}
                max={currentDate}
                required
                className="px-2 py-1 border rounded-md outline-none"
              />

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-3/4 p-2 font-bold text-center border rounded-md outline-none"
              />

              <textarea
                placeholder="Diary Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="p-4 border rounded-md w-[60rem] h-[20rem] outline-none bg-slate-100"
              />

              {/* <div className="flex flex-col items-center w-full gap-4">
                <div className='flex items-center justify-center gap-5'>
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="object-cover h-20 rounded-md" />
                      <button onClick={() => setImage(null)} className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-700">
                        <RxCross2 size={20} />
                      </button>
                    </div>
                  )}

                  {audioPreview && (
                    <div className="relative">
                      <audio controls src={audioPreview} className="rounded-md w-28" />
                      <button onClick={() => setAudio(null)} className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-700">
                        <RxCross2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div> */}

              <div className="flex items-center justify-between gap-10">
                {/* <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={imageInputRef}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <button onClick={() => imageInputRef.current.click()} className="p-2 bg-gray-200 rounded-md outline-none hover:bg-gray-300">
                    <FaImage size={24} />
                  </button>
                </div>

                <div>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    ref={audioInputRef}
                    onChange={(e) => setAudio(e.target.files[0])}
                  /> */}
                  {/* <button onClick={() => audioInputRef.current.click()} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                    <MdOutlineAudiotrack size={24} />
                  </button>
                </div> */}

                <button onClick={handleAddDiary} className="w-24 p-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                  Save
                </button>
              </div>

              {consecutiveNegDays > 0 && (
                <div className="mt-4 text-center">
                  <p>You’ve had {consecutiveNegDays} consecutive days of negative emotions.</p>
                  <p>{activity}</p>
                  <p>{musicRecommendation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDiary;
