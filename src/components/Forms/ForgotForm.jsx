import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase-config';
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitForm = async (data) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, data.email);
      toast.success('Password reset link sent successfully!');
    } catch (error) {
      console.log("Error during password reset:", error); 
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'No user found with this email.'
        : 'Failed to send reset link. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-5">
          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-base font-semibold">Email</label>
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
              className="h-12 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            className={`w-full h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotForm;
