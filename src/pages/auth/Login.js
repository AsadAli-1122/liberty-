import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import {
  validateEmail,
} from '../../components/utils/validation';
import BackandHeading from '../../components/header/BackandHeading';

const Login = () => {
  const { user, auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'email':
        errorMessage = validateEmail(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if there are any errors in the form fields
    const formErrors = Object.values(errors);
    if (formErrors.some((error) => error !== '')) {
      toast.error('Fix all errors to Login');
      console.log(errors)
      return;
    }


    try {
      const { email, password } = formData;
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
      toast.success('Login successful!');
    } catch (error) {
      console.log(error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User does not exist.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'User is blocked by the admin.';
      }
      toast.error(errorMessage);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const isFormValid = formData.email === '' || formData.password === '';

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container px-4 md:px-20 max-w-4xl mx-auto">
        <form onSubmit={handleLogin}>
          <BackandHeading topHeading={'Login'} />
          <div className="border-2 border-gray-300 mb-20 pt-14 pb-14 px-4 rounded-xl flex flex-col justify-center items-center space-y-4">
            <div className='max-w-xs w-full' >

            <div className="border border-slate-500 w-full rounded-md max-w-xs">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border-none px-6 focus:ring-0"
              />
            </div>
              {errors.email && (
                <p className="px-2 text-red-600 text-xs max-w-xs">{errors.email}</p>
                )}
                </div>
                <div className='max-w-xs w-full' >

            <div className="w-full flex items-center border border-slate-500 rounded-md max-w-xs">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full border-none pr-6 focus:ring-0"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button pr-6"
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                    <i className="fa-solid fa-eye"></i>
                    )}
              </button>
            </div>
                </div>
            <div className="pt-8">
              <button
                type="submit"
                className={`bg-red-600 ${
                  isFormValid ? 'disabled:bg-red-400' : 'hover:bg-red-800'
                } text-white tracking-wider font-bold px-10 py-2 w-fit rounded-3xl`}
                disabled={isFormValid}
              >
                Login
              </button>
            </div>
            <div className="pb-8">
              Don't have an account?{' '}
              <Link to="/register" className="underline underline-offset-2 hover:text-red-700">
                Signup
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
