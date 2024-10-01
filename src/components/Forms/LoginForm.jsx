import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';
import LoginProvider from './LoginProvider';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate(); 

  const handleLogin = async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login successful");
      navigate('/dashboard'); 
    } catch (error) {
      toast.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-6'>
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
              className='h-12 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
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
              className='h-12 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <a href="/forgot" className="text-sm text-blue-600 hover:underline mt-1">Forgot Password?</a>
          </div>
          <button
            type='submit'
            className='w-full h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300'
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="flex items-center justify-center mt-4">
          <hr className="w-1/3" />
          <span className="mx-4 text-gray-600">or</span>
          <hr className="w-1/3" />
        </div>
        <LoginProvider />
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginForm;
