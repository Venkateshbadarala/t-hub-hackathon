import React from 'react';
import { auth } from '../../firebase-config'; 
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import GoogleIcon from './google.png';

const providers = [
    {
        name: "google",
        displayName: "Continue with Google",
        icon: GoogleIcon,
    },
];

const LoginProvider = () => {
    const navigate = useNavigate(); 

    const handleSignin = async (providerName) => {
        if (providerName === "google") {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                console.log("User signed in: ", result.user);
                navigate('/dashboard'); 
            } catch (error) {
                console.error("Error signing in: ", error.message);
            }
        }
    };

    return (
        <div>
            {providers.map((item, index) => (
                <button
                    onClick={() => handleSignin(item.name)}
                    key={index}
                    className='flex flex-row items-center justify-center gap-6 text-xl font-bold bg-blue-300 rounded shadow-2xl w-96 h-14'>
                    {item.displayName}
                    <img src={item.icon} height={30} width={30} alt='Google icon' />
                </button>
            ))}
        </div>
    );
};

export default LoginProvider;
