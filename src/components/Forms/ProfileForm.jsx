"use client";
import React, { useEffect, useState } from 'react';
import { auth, db, storage } from "@/firebase"; // Adjust the import as necessary
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileForm = () => {
    const [imageSrc, setImageSrc] = useState("https://placehold.co/300x300.png");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [user] = useAuthState(auth); // Get the authenticated user

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setImageSrc(userData.image || "https://placehold.co/300x300.png");
                    setEmail(userData.email || "");
                    setName(userData.name || "");
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImageSrc(imageUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return; 
        let imageUrl = '';
        if (selectedImage) {
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            imageUrl = await uploadImage(storageRef, selectedImage);
        }

        const userData = {
            image: imageUrl,
            name,
            email,
            password,
        };

        try {
            await setDoc(doc(db, "users", user.uid), userData, { merge: true });
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Error updating profile. Please try again.");
        }
    };

    const uploadImage = async (storageRef, file) => {
        const imageData = await uploadString(storageRef, await convertToBase64(file), 'data_url');
        return imageData.ref.toString();
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 rounded">
                <div className="flex flex-col items-center gap-5">
                    <label htmlFor="profilePic">PROFILE PIC</label>
                    <Image
                        src={imageSrc}
                        alt="User Avatar"
                        height={112}
                        width={112}
                        className="rounded-full h-28 w-28"
                        onError={() => setImageSrc("https://placehold.co/300x300.png")}
                    />
                    <input 
                        type="file" 
                        id="profilePic" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="mt-2"
                    />
                </div>

                {['name', 'email', 'password'].map((field) => (
                    <div key={field} className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor={field} className="text-base font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={field === 'password' ? 'password' : 'text'}
                            id={field}
                            value={field === 'name' ? name : field === 'email' ? email : password}
                            onChange={(e) => field === 'name' ? setName(e.target.value) : field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="h-12 border border-gray-300 rounded w-96"
                        />
                    </div>
                ))}

                <button type="submit" className="w-24 h-12 text-white bg-blue-500 border rounded">Submit</button>
            </form>
        </div>
    );
};

export default ProfileForm;
