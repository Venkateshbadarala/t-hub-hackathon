import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase-config';
import { doc, collection, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaTrash } from 'react-icons/fa';

const AddDiary = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [audioPreview, setAudioPreview] = useState('');

  // Setup MediaRecorder when the component mounts
  useEffect(() => {
    if (recorder === null && isRecording) {
      requestMicrophoneAccess();
    } else if (!isRecording && recorder) {
      recorder.stop();
    }
  }, [isRecording]);

  useEffect(() => {
    if (image) {
      setImagePreview(URL.createObjectURL(image));
    }
  }, [image]);

  useEffect(() => {
    if (audio) {
      setAudioPreview(URL.createObjectURL(audio));
    }
  }, [audio]);

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        setRecordedAudio(event.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
    } catch (error) {
      console.error('Error accessing microphone:', error.message);
      alert('Microphone access denied. Please enable it to record audio.');
    }
  };

  const handleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const handleAddDiary = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to add a diary entry.');
        return;
      }

      const userDocRef = doc(db, 'users', user.email);
      const diaryCollectionRef = collection(userDocRef, 'diaries');
      let imageUrl = '';
      let audioUrl = '';

      if (image) {
        const imageRef = ref(storage, `diaries/${user.uid}/${date}/image`);
        const imageSnapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageSnapshot.ref);
      }

      if (audio) {
        const audioRef = ref(storage, `diaries/${user.uid}/${date}/audio`);
        const audioSnapshot = await uploadBytes(audioRef, audio);
        audioUrl = await getDownloadURL(audioSnapshot.ref);
      }

      if (recordedAudio) {
        const recordedAudioRef = ref(storage, `diaries/${user.uid}/${date}/recorded-audio`);
        const recordedAudioSnapshot = await uploadBytes(recordedAudioRef, recordedAudio);
        audioUrl = await getDownloadURL(recordedAudioSnapshot.ref);
      }

      await setDoc(doc(diaryCollectionRef, date), {
        title,
        content,
        date: new Date(date).toISOString(),
        imageUrl,
        audioUrl,
      });

      alert('Diary entry added!');
      resetForm();
    } catch (error) {
      console.error('Error adding diary entry:', error.message);
      alert('Error adding diary entry: ' + error.message);
    }
  };

  const resetForm = () => {
    setContent('');
    setTitle('');
    setDate('');
    setImage(null);
    setAudio(null);
    setRecordedAudio(null);
    setImagePreview('');
    setAudioPreview('');
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleRemoveAudio = () => {
    setAudio(null);
    setAudioPreview('');
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 font-serif border border-yellow-200 rounded-lg shadow-lg ">
      <h2 className="mb-4 text-2xl font-bold text-center text-orange-400">Add Diary Entry</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="px-3 py-2 transition border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="px-3 py-2 transition border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
        />
        <textarea
          placeholder="Diary Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="border border-orange-300 rounded-md px-3 py-2 min-h-[100px] resize-none focus:outline-none focus:border-orange-500 transition"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="px-3 py-2 transition border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
        />
        {imagePreview && (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
            <button onClick={handleRemoveImage} className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2">
              <FaTrash />
            </button>
          </div>
        )}
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
          className="px-3 py-2 transition border border-orange-300 rounded-md focus:outline-none focus:border-orange-500"
        />
        {audioPreview && (
          <div className="relative">
            <audio controls src={audioPreview} className="w-full rounded-md" />
            <button onClick={handleRemoveAudio} className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2">
              <FaTrash />
            </button>
          </div>
        )}
        <button
          onClick={handleRecording}
          className={`px-4 py-2 text-white transition rounded-md ${isRecording ? 'bg-red-500' : 'bg-green-500'} hover:bg-green-700`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {recordedAudio && <p>Recorded Audio Ready</p>}
        <button
          onClick={handleAddDiary}
          className="px-4 py-2 text-white transition bg-orange-500 rounded-md hover:bg-orange-700"
        >
          Add Entry
        </button>
      </div>
    </div>
  );
};

export default AddDiary;
