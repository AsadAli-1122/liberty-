import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import BackandHeading from '../../components/header/BackandHeading';

const Forgot = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
  }, [auth, navigate]);

  const handleForgot = (event) => {
    event.preventDefault();
    sendPasswordResetEmail(auth, user)
      .then(() => {
        console.log('password reset email send success');
        navigate('/');
        toast.success('Password reset email sent!');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ' ', errorMessage);
        if (errorCode === 'auth/too-many-requests') {
          toast.error('Password reset email already sent. Please wait a while.');
        } else if (errorCode === 'auth/user-not-found') {
          toast.error("User doesn't exist.");
        } else {
          toast.error('Failed to send password reset email. Please try again.');
        }
      });
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container px-4 md:px-20 max-w-4xl mx-auto">
        <form onSubmit={handleForgot}>
          <BackandHeading topHeading={'Forgot Password'} />
          <div className="border-2 border-gray-300 mb-20 pt-14 pb-14 px-4 rounded-xl flex flex-col justify-center items-center space-y-4">
            <div className="border border-slate-500 w-full rounded-md max-w-xs">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-md border-none px-6 focus:ring-0"
              />
            </div>
            <div className="pt-8">
              <button
                type="submit"
                className="bg-red-600 disabled:bg-red-400 hover:bg-red-800 text-white tracking-wider font-bold px-10 py-2 w-fit rounded-3xl"
              >
                Send Mail
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
