import React, { useState, useCallback, useContext, useEffect } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../context/firebase'
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from '../../components/utils/validation'
import BackandHeading from '../../components/header/BackandHeading';


const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { user, auth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  
    validateInput(name, value, name === "password" ? value : formData.password);
  }, [formData.password]);
  
  

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prevState) => !prevState);
  }, []);

  const db = getDatabase(app);
  // eslint-disable-next-line 
  const [userId, setUserId] = useState('');

  const validateInput = (name, value, passwordValue) => {
    let errorMessage = '';
    switch (name) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'confirmPassword':
        errorMessage = validateConfirmPassword(value, passwordValue);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if there are any errors in the form fields
    const formErrors = Object.values(errors);
    if (formErrors.some((error) => error !== '')) {
      toast.error('Fix all errors to Register your account');
      console.log(errors)
      return;
    }


    try {
      const { email, password } = formData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUserId(userCredential.user.uid);

      // Set the default role to "user" for all registered users
      let userRole = 'user';

      // Check if the registered user's email matches the admin email
      if (email === 'admin@example.com') {
        // Assign the role of "admin" to the user with the specified admin email
        userRole = 'admin';
      }

      await set(ref(db, `users/${userCredential.user.uid}`), {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        role: userRole, // Assign the role to the user,
        UserId: userCredential.user.uid,
      });

      await toast.promise(
        Promise.resolve('Registration successful!'),
        {
          loading: 'Saving...',
          success: 'Registration successful!',
          error: 'Registration failed. Please try again.',
        }
      );

      navigate('/');
    } catch (error) {
      console.log(error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already exists. Please use a different email.';
      }
      toast.error(errorMessage);
    }
  };

  const isFormValid =
    Object.values(formData).some((value) => value === '');


  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="container px-4 md:px-20 max-w-4xl mx-auto">
        <form onSubmit={handleRegister}>
          <BackandHeading topHeading={'Register'} />
          <div className='border-2 border-gray-300 mb-20 pt-14 pb-14 px-4 rounded-xl flex flex-col justify-center items-center space-y-4'>
            <div className='w-full max-w-xs'>
              <div className='border border-slate-500 w-full rounded-md'>
                <input type="email" name="email" id="email" placeholder='Email' value={formData.email}
                  onChange={handleInputChange} className='w-full rounded-md border-none px-6 focus:ring-0' />
              </div>
              {errors.email && <span className="px-2 text-red-600 text-xs max-w-xs">{errors.email}</span>}
            </div>
            <div className='w-full max-w-xs'>

              <div className='w-full flex items-center border border-slate-500 rounded-md max-w-xs'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  className="w-full border-none pr-6 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-button pr-6 focus:ring-0 focus:border-none focus:outline-none"
                >
                  {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </button>
              </div>
              {errors.password && <span className="px-2 text-red-600 text-xs max-w-xs">{errors.password}</span>}
            </div>
            <div className='w-full max-w-xs'>

              <div className='w-full flex items-center border border-slate-500 rounded-md max-w-xs'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full border-none pr-6 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="password-toggle-button pr-6 focus:ring-0 focus:border-none focus:outline-none"
                >
                  {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </button>
              </div>
              {errors.confirmPassword && <span className="px-2 text-red-600 text-xs max-w-xs">{errors.confirmPassword}</span>}
            </div>
            <div className='pt-8'>
              <button type='submit' disabled={isFormValid} className='bg-red-600 disabled:bg-red-400 hover:bg-red-800 text-white tracking-wider font-bold px-10 py-2 w-fit rounded-3xl'>Register</button>
            </div>
            <div className='pb-8'>
              Have an account? <Link to='/login' className='underline underline-offset-2 hover:text-red-700'>Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
