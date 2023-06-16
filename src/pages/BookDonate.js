import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, push, ref as databaseRef, set } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import BackandHeading from '../components/header/BackandHeading';

const BookDonate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);


  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    booktitle: '',
    category: '',
    author: '',
    quantity: '',
    isbn: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Upload file to Firebase Storage
    if (file) {
      const storage = getStorage();
      const storageReference = storageRef(storage, 'bookCovers/' + file.name);
      uploadBytes(storageReference, file)
        .then((snapshot) => {
          // Get the download URL of the uploaded file
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              // Save book data in Firebase Realtime Database with a new ID and Date.now() timestamp
              const db = getDatabase();
              const booksRef = databaseRef(db, 'donatedBooks');
              const newBookRef = push(booksRef);
              const timestamp = Date.now();
              const bookData = {
                ...formData,
                timestamp,
                UserUid: user.uid,
                bookCoverURL: downloadURL,
              };
              set(newBookRef, bookData)
                .then(() => {
                  toast.success("We have received your book donation. Thank you!");
                  // Clear form fields after successful submission
                  setFormData({
                    booktitle: '',
                    category: '',
                    author: '',
                    quantity: '',
                    isbn: '',
                    setFile: null,
                  });
                })
                .catch((error) => {
                  toast.error('Failed to submit book donation:', error);
                });
            })
            .catch((error) => {
              toast.error('Failed to get download URL:', error);
            });
        })
        .catch((error) => {
          toast.error('Failed to upload file:', error);
        });
    } else {
      toast.error('Please select a file');
    }
  };


  const handleReset = () => {
    // Clear form fields when the "Cancel" button is clicked
    setFormData({
      booktitle: '',
      category: '',
      author: '',
      quantity: '',
      isbn: '',
      setFile: null,
    });
  };

  const isFormEmpty = Object.values(formData).some((value) => value === '');

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>
        <BackandHeading topHeading={'Donate'} />
        <div className=''>
          <form className='w-full border-[1.5px] border-gray-300 px-6 pb-12 my-12 rounded-2xl space-y-6'>
            <h1 className='font-bold tracking-wider text-2xl my-4 text-center px-20 mb-12'>Donate a book and be a part of our family</h1>
            <div className='flex flex-col space-y-4 px-12'>
              <input
                type="text"
                className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                placeholder='Book title'
                name='booktitle'
                value={formData.booktitle}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                placeholder='Category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                placeholder='Author'
                name='author'
                value={formData.author}
                onChange={handleInputChange}
              />
              <input
                type="number"
                className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                placeholder='Quantity'
                name='quantity'
                value={formData.quantity}
                onChange={handleInputChange}
              />
              <input
                type="number"
                className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                placeholder='ISBN Number'
                name='isbn'
                value={formData.isbn}
                onChange={handleInputChange}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="rounded-md border-[1.5px] border-slate-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full cursor-pointer"
                placeholder="National ID Picture"
              />
            </div>
            <div className='flex justify-center space-x-12'>
              <button type='reset' className='text-center px-14 py-2 rounded-3xl border-[1.5px] border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold text-xl' onClick={handleReset}>Cancel</button>
              <button type='submit' className='text-center px-14 py-2 rounded-3xl bg-[#DE1212] disabled:bg-[#a44c4c] hover:bg-[#a20606] text-white font-semibold text-xl' onClick={handleSubmit} disabled={isFormEmpty}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDonate;
