import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import BackandHeading from '../components/header/BackandHeading';
import Search from '../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../context/firebase';
import { Rating } from '@mui/material';
// eslint-disable-next-line
import { Toaster, toast } from 'react-hot-toast';

const Favorite = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const db = getDatabase(app);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Fetch data from the database
      const favoritesRef = ref(db, 'Favorites');
      onValue(favoritesRef, (snapshot) => {
        const data = snapshot.val();
        // Filter and process the data
        const filteredData = Object.values(data).filter(
          (item) => item.userId === user.uid
        );
        const bookIds = filteredData.map((item) => item.bookId);
        // Fetch the specific books from UploadBooks
        const booksRef = ref(db, 'UploadBooks');
        onValue(booksRef, (snapshot) => {
          const booksData = snapshot.val();
          // Filter books based on bookIds
          const filteredBooks = Object.entries(booksData)
            .filter(([id]) => bookIds.includes(id))
            .map(([id, book]) => ({ id, ...book }));

          setFilteredBooks(filteredBooks);
        }, (error) => {
          console.log('Error fetching books:', error);
        });
      }, (error) => {
        console.log('Error fetching data:', error);
      });
    }
  }, [user, navigate, db]);

  return (
    <div className='max-w-5xl mx-auto pt-6 pb-10'>
      <Toaster position="top-center" reverseOrder={false} />
      <BackandHeading topHeading={'Favorites'} />
      <Search />

      {filteredBooks.length === 0 ? (
        (navigate('/books'))
        
      ) : (
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          {filteredBooks.map((book) => (
            <li key={book.id} className='flex flex-col justify-between'>
              <div className='flex flex-col justify-center'>
                <div className='flex justify-center items-center w-full h-72 overflow-hidden border-[1px] border-gray-300 rounded-xl mx-auto'>
                  <img src={book.bookCoverURL} alt={book.booktitle} className='w-full' />
                </div>
                <div className=''>
                  <Link to={`/book/${book.id}`}>
                    <h1 className='my-2 text-2xl font-bold tracking-wider capitalize'>{book.booktitle}</h1>
                  </Link>
                  <h2 className='my-2 text-lg font-semibold tracking-wider'>by {book.author}</h2>
                </div>
              </div>
              <div className=''>
                <Rating name="read-only" value={3} readOnly />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorite;
