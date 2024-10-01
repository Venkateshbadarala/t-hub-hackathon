import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { register, handleSubmit, formState: { errors } } = useForm({
    reValidateMode: "onChange",
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        createdAt: new Date(),
      });

      toast.success('User registered successfully!');
      toast.success('A verification link has been sent to your email.');
      navigate('/login');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error('Email already exists');
      } else {
        toast.error('Registration failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit(handleRegister)} className='flex flex-col gap-5'>
          <div className="grid gap-1.5">
            <label htmlFor="name" className='text-base font-semibold'>Username</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              {...register("name", { required: "Name is required" })}
              className='h-12 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="email" className='text-base font-semibold'>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Example@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className='h-12 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="password" className='text-base font-semibold'>Password</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
              className='h-12 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegisterForm;
