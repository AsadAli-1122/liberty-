import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { toast } from 'react-hot-toast';



const ChangePassword = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
          navigate('/');
        }
      }, [user, navigate]);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
      
        try {
          const credential = EmailAuthProvider.credential(user.email, oldPassword);
      
          // Reauthenticate user with the old password
          await reauthenticateWithCredential(user, credential);
      
          // Change the password
          await updatePassword(user, newPassword);
      
          // Reset input fields
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
      
          toast.success('Password changed successfully');
        } catch (error) {
          console.log('Error changing password:', error);
      
          if (error.code === 'auth/wrong-password') {
            toast.error('Wrong old password');
          } else if(error.code === 'auth/weak-password'){
            toast.error('Password Should at least 6 characters')
          } 
          else {
            toast.error('Error changing password');
          }
        }
      };
      
      


    return (
        <div>
            <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>
                <div className='w-full flex justify-between items-center'>
                    <div>
                        <Link to='/'>
                            <i className='fa-solid fa-arrow-left text-3xl cursor-pointer'></i>
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold'>Change Password</h1>
                    </div>
                </div>
                <div className=''>
                    <form
                        className='w-full border-[1.5px] border-gray-300 px-6 py-12 my-12 rounded-2xl space-y-6'
                        onSubmit={handleSubmit}
                    >
                        <div className='flex flex-col items-center space-y-6 px-12'>
                            <div className='w-full flex items-center border border-slate-500 rounded-md max-w-xs'>
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    name='oldPassword'
                                    id='oldPassword'
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder='Old Password'
                                    className='w-full border-none pr-6 focus:ring-0'
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='password-toggle-button pr-6 focus:ring-0 focus:border-none focus:outline-none'
                                >
                                    {showOldPassword ? (
                                        <i className='fa-solid fa-eye-slash'></i>
                                    ) : (
                                        <i className='fa-solid fa-eye'></i>
                                    )}
                                </button>
                            </div>
                            <div className='w-full flex items-center border border-slate-500 rounded-md max-w-xs'>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name='newPassword'
                                    id='newPassword'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='New Password'
                                    className='w-full border-none pr-6 focus:ring-0'
                                />
                                <button
                                    type='button'
                                    onClick={toggleNewPasswordVisibility}
                                    className='password-toggle-button pr-6 focus:ring-0 focus:border-none focus:outline-none'
                                >
                                    {showNewPassword ? (
                                        <i className='fa-solid fa-eye-slash'></i>
                                    ) : (
                                        <i className='fa-solid fa-eye'></i>
                                    )}
                                </button>
                            </div>
                            <div className='w-full flex items-center border border-slate-500 rounded-md max-w-xs'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm Password'
                                    className='w-full border-none pr-6 focus:ring-0'
                                />
                                <button
                                    type='button'
                                    onClick={toggleConfirmPasswordVisibility}
                                    className='password-toggle-button pr-6 focus:ring-0 focus:border-none focus:outline-none'
                                >
                                    {showConfirmPassword ? (
                                        <i className='fa-solid fa-eye-slash'></i>
                                    ) : (
                                        <i className='fa-solid fa-eye'></i>
                                    )}
                                </button>
                            </div>
                            <div>
                            <button type='submit' className='bg-red-600 disabled:bg-red-400 hover:bg-red-800 text-white tracking-wider font-bold px-10 py-2 w-fit rounded-3xl'>Change Password</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default ChangePassword
