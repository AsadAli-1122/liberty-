import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref as ref_database, onValue, get } from 'firebase/database';
import { app } from '../context/firebase';
import { CircularProgress, Rating } from '@mui/material';
import Search from '../components/Search';
import CategoryButtons from '../components/CategoryButtons';
import BackandHeading from '../components/header/BackandHeading';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(8);
   // eslint-disable-next-line 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const db = getDatabase(app);
    const booksRef = ref_database(db, 'UploadBooks');

    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookList = Object.keys(data).map(async (key) => {
          const bookData = data[key];
          const userSnapshot = await get(ref_database(db, `users/${bookData.UserUid}`));
          const user = userSnapshot.val();
          const bookWithUser = {
            id: key,
            ...bookData,
            user: user ? user.firstName + " " + user.lastName : 'Unknown User',
            email: user ? user.email : 'Unknown Email',
          };
          return bookWithUser;
        });
        Promise.all(bookList).then((completedBooks) => {
          setBooks(completedBooks);
        });
      }
      setLoading(false);
    });

  }, []);

  const handleShowMore = () => {
    setVisibleBooks((prevVisibleBooks) => prevVisibleBooks + 8);
  };

  const visibleBookList = books.slice(0, visibleBooks);

  if(books && books.length === 0) {
return <div className='flex justify-center items-center h-20'>
<div className='loader'><CircularProgress color="inherit" /></div>
</div>
  }

  return (
    <div className='mx-auto my-12 max-w-5xl'>
      <BackandHeading topHeading={'All Books'} />
      <div>
        <Search border={'border'} />
        {books && books.length > 0 ? (
          <>
            <CategoryButtons />
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>

              {visibleBookList.map((book) => (
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
          </>
        ) : (
          <p>No books available</p>
        )}
        {books.length > visibleBooks && (
          <div className='flex justify-center items-center mt-4'>
            <button
              className='px-6 py-1 rounded-md border-[1.5px] border-[#DE1212] hover:border-[#a20606] text-[#DE1212] hover:text-[#a20606] font-semibold w-fit'
              onClick={handleShowMore}
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
