import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, push, ref as databaseRef, set, onValue } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Select from "react-select";
import {
  validateBookTitle,
  validateCategory,
  validateAuthor,
  validateQuantity,
  validatePrice,
  validateISBN,
  validateDescription,
} from '../components/utils/validation';
import BackandHeading from '../components/header/BackandHeading';


const UploadBook = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { BookId } = useParams();
  // eslint-disable-next-line
  const [bookData, setBookData] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.userData.role !== 'admin') {
      navigate('/');
    }
    
    const db = getDatabase();
    const UploadBooksRef = databaseRef(db, `UploadBooks/${BookId}`);
    onValue(UploadBooksRef, (snapshot) => {
      const BookData = snapshot.val();
      setBookData(BookData)
    });
    
  }, [user, navigate, BookId]);
  

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    booktitle: '',
    category: '',
    author: '',
    type: null,
    borrowTime: null,
    quantity: '',
    price: '',
    isbn: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    booktitle: '',
    category: '',
    author: '',
    quantity: '',
    price: '',
    isbn: '',
    description: '',
  });

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
      case 'booktitle':
        errorMessage = validateBookTitle(value);
        break;
      case 'category':
        errorMessage = validateCategory(value);
        break;
      case 'author':
        errorMessage = validateAuthor(value);
        break;
      case 'quantity':
        errorMessage = validateQuantity(value);
        break;
      case 'price':
        errorMessage = validatePrice(value);
        break;
      case 'isbn':
        errorMessage = validateISBN(value);
        break;
      case 'description':
        errorMessage = validateDescription(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1.5px solid rgb(156 163 175)" : "1.5px solid #ccc",
      borderRadius: "4px",
      boxShadow: "none",
      paddingTop: "2px",
      paddingBottom: "2px",
      "&:hover": {
        cursor: "pointer",
      },
    }),
  };

  const types = [
    { value: 'polpular', label: 'Popular' },
    { value: 'recomended', label: 'Recomended' },
    { value: 'favorite', label: 'Most Favorite' },
    { value: 'liked', label: 'Most Liked' },
  ];

  const borrowTime = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
  ];

  const handleTypeChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: selectedOption,
    }));
  };

  const handleBorrowTimeChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      borrowTime: selectedOption,
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there are any errors in the form fields
    const formErrors = Object.values(errors);
    if (formErrors.some((error) => error !== '')) {
      toast.error('Fix all errors to publish the book');
      console.log(errors)
      return;
    }

    // Upload file to Firebase Storage
    if (file) {
      const storage = getStorage();
      const storageReference = storageRef(storage, 'UploadBooks/' + file.name);
      uploadBytes(storageReference, file)
        .then((snapshot) => {
          // Get the download URL of the uploaded file
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              // Save book data in Firebase Realtime Database with a new ID and Date.now() timestamp
              const db = getDatabase();
              const booksRef = databaseRef(db, 'UploadBooks');
              const newBookRef = push(booksRef);
              const timestamp = Date.now();
              const bookData = {
                ...formData,
                timestamp,
                UserUid: user.uid,
                bookCoverURL: downloadURL,
                BookId: newBookRef.key,
              };
              set(newBookRef, bookData)
                .then(() => {
                  toast.success("Book Published Success");
                  navigate('/books')
                  // Clear form fields after successful submission
                  setFormData({
                    booktitle: '',
                    category: '',
                    author: '',
                    type: null,
                    borrowTime: null,
                    quantity: '',
                    price: '',
                    isbn: '',
                    description: '',
                    setFile: null,
                  });
                })
                .catch((error) => {
                  toast.error('Failed to upload book:', error);
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
      toast.error('Please select a cover picture of book');
    }
  };


  const handleReset = () => {
    // Clear form fields when the "Cancel" button is clicked
    setFormData({
      booktitle: '',
      category: '',
      author: '',
      type: null,
      borrowTime: null,
      quantity: '',
      price: '',
      isbn: '',
      description: '',
      setFile: null,
    });
  };

  const isFormValid =
    Object.values(formData).some((value) => value === '') ||
    !formData.type ||
    !formData.borrowTime; 
    // || Object.values(errors).some((error) => error !== '');


  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>
        <BackandHeading topHeading={'Upload Book'} />
        <div className=''>
          <form className='w-full border-[1.5px] border-gray-300 px-6 pb-12 my-12 rounded-2xl space-y-6'>
            <h1 className='font-bold tracking-wider text-2xl my-4 text-center px-20 mb-12'>Book Details</h1>
            <div className='flex flex-col space-y-4 px-12'>
              <div>
                <input
                  type="text"
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Book title'
                  name='booktitle'
                  value={formData.booktitle}
                  onChange={handleInputChange}
                />
                {errors.booktitle && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.booktitle}</p>}
              </div>
              <div>
                <input
                  type="text"
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Category'
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                />
                {errors.category && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.category}</p>}
              </div>
              <div>
                <input
                  type="text"
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Author'
                  name='author'
                  value={formData.author}
                  onChange={handleInputChange}
                />
                {errors.author && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.author}</p>}
              </div>
              <div>
                <Select
                  className="w-full"
                  styles={customStyles}
                  options={types}
                  onChange={handleTypeChange}
                  isClearable={true}
                  placeholder="Type"
                  name='type'
                  value={formData.type}
                />
              </div>
              <div>
                <Select
                  className="w-full"
                  styles={customStyles}
                  options={borrowTime}
                  onChange={handleBorrowTimeChange}
                  isClearable={true}
                  placeholder="Borrowing Time"
                  name='borrowTime'
                  value={formData.borrowTime}
                />
              </div>
              <div>
                <input
                  type="number"
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Price'
                  name='price'
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {errors.price && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.price}</p>}
              </div>
              <div>
                <input
                  type="number"
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Quantity'
                  name='quantity'
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
                {errors.quantity && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <input
                  type="number"
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='ISBN Number'
                  name='isbn'
                  value={formData.isbn}
                  onChange={handleInputChange}
                />
                {errors.isbn && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.isbn}</p>}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="rounded-md border-[1.5px] border-slate-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full cursor-pointer"
                  placeholder="National ID Picture"
                />
              </div>
              <div>
                <textarea
                  cols=''
                  rows='5'
                  className='resize-none rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {errors.description && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.description}</p>}
              </div>
            </div>
            <div className='flex justify-center space-x-12'>
              <button type='reset' className='text-center px-14 py-2 rounded-3xl border-[1.5px] border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold text-xl' onClick={handleReset}>Cancel</button>
              <button type='submit' className='text-center px-14 py-2 rounded-3xl bg-[#DE1212] disabled:bg-[#a44c4c] hover:bg-[#a20606] text-white font-semibold text-xl' onClick={handleSubmit} disabled={isFormValid}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default UploadBook;
