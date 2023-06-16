import { signOut } from 'firebase/auth';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

const ProfileDropdown = () => {
  const { user, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    signOut(auth)
    .then(() => {
      navigate('/');
      toast.success('Logout successful');
      setIsOpen(false)
      })
      .catch((error) => {
        console.log('Logout Error:', error);
      });
  };

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <Toaster position="top-center" reverseOrder={false} />
      <button
        type="button"
        className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none"
        onClick={toggleDropdown}
      >
        <i className="fa-solid fa-user text-black"></i>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="profile-menu">
            {user ? (
              <>
                <Link to="/profile-update" onClick={() => { setIsOpen(false) }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                  Profile Update
                </Link>
                <Link to="/profile-update" onClick={() => { setIsOpen(false) }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                  Setting
                </Link>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout} role="menuitem"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => { setIsOpen(false) }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" >
                  Login
                </Link>
                <Link to="/register" onClick={() => { setIsOpen(false) }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
