import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getDatabase, ref, get, onValue, child } from 'firebase/database';
import { app } from '../context/firebase';
import BackandHeading from '../components/header/BackandHeading';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { calculateTimeLeft, formatDate } from '../components/utils/Functions';
import BorrowNowModal from '../components/BorrowNowModal';
import LostButton from '../components/buttons/LostButton';
import ReturnBook from '../components/buttons/ReturnBook';
import RateModal from '../components/RateModal';
import AverageRating from '../components/AverageRating';

const MyBooks = () => {
  const { user } = useContext(AuthContext);
  const [confirmOrders, setConfirmOrders] = useState([]);
  const [bookDetails, setBookDetails] = useState({});

  const db = getDatabase(app);

  useEffect(() => {
    if (user) {
      const confirmOrdersRef = ref(db, `ConfirmOrders/${user.uid}`);

      onValue(confirmOrdersRef, (snapshot) => {
        const confirmOrdersData = snapshot.val();
        if (confirmOrdersData) {
          const confirmOrdersList = Object.values(confirmOrdersData);
          setConfirmOrders(confirmOrdersList);
          // console.log(confirmOrdersList)
        }
      });
    }
  }, [user, db]);


  useEffect(() => {
    const fetchBookDetails = async () => {
      const booksDataRef = ref(db, 'UploadBooks');
    
      for (const order of confirmOrders) {
        if (order.BookId) {
          // console.log(order.BookId)
          const bookRef = child(booksDataRef, order.BookId);
          const snapshot = await get(bookRef);
          if (snapshot.exists()) {
            const matchedBook = snapshot.val();
            setBookDetails((prevDetails) => ({
              ...prevDetails,
              [order.BookId]: matchedBook,
            }));
          }
        }
      }
    };
    
    fetchBookDetails();
    
  }, [confirmOrders, db]);

  const returnedBooks = confirmOrders.filter((order) => !order.time);
  const allBooks = confirmOrders.filter((order) => order.time);

  allBooks.sort((a, b) => {
    const daysLeftA = calculateTimeLeft(a);
    const daysLeftB = calculateTimeLeft(b);
    return daysLeftA - daysLeftB;
  });


  return (
    <div className='max-w-5xl mx-auto'>
      <BackandHeading topHeading={'My Books'} />
      <div className='my-4 border-t border-gray-300 py-4'>
        {allBooks.length === 0 ? (
          <>
            <h1 className='text-center text-3xl font-semibold'>You have not borrowed any book till now</h1>
          </>
        ) : (
          allBooks.map((order) => {
            const book = bookDetails[order.BookId];
            if (!book) return null;
            return (
              <div key={order.BookId} className='flex space-x-4 md:space-x-8 pb-4'>
                <div className='flex w-40 h-52 overflow-hidden border-[1px] border-gray-300 rounded-xl'>
                  <img src={book.bookCoverURL} alt={book.booktitle} className='w-full' />
                </div>
                <div className='flex flex-col justify-between mb-2'>
                  <div>
                    <Link to={`/book/${order.BookId}`}>
                      <h1 className='mt-1 text-2xl font-bold tracking-wider capitalize'>{book.booktitle}</h1>
                    </Link>
                    <h2 className='mt-1 text-lg font-semibold tracking-wider'>by {book.author}</h2>
                    <h2 className='mt-1 text-lg font-bold tracking-wider'>Price : {order.bookPrice} UGX</h2>
                  </div>

                  <div className='flex items-center space-x-6'>
                    <AverageRating bookId={order.BookId} />
                    <RateModal book={order} id={order.BookId} />
                  </div>
                  <div className='flex space-x-8'>
                    <div className='text-xl font-semibold flex items-center justify-center space-x-2'>
                      <span>Duration : </span>
                      <span className='font-extrabold'> {order.borrowTime} - {order.borrowTimePeriod} </span>
                    </div>
                    <div className='text-xl font-bold flex items-center justify-center space-x-2'>
                      <span>Days Left : </span>
                      <span className='text-[#DE1212]'>{calculateTimeLeft(order)}</span>
                    </div>
                  </div>
                  <div className='flex flex-wrap space-x-6 items-center'>
                    <ReturnBook userId={user.uid} bookId={order.BookId} />
                    <BorrowNowModal book={book} id={order.BookId} />
                    <LostButton userId={user.uid} bookId={order.BookId} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {returnedBooks.length === 0 ? (
        <></>
      ) : (
        <div>
          <h1 className='text-3xl font-bold mb-6'>Returned Books</h1>
          {returnedBooks.map((order) => {
            const book = bookDetails[order.BookId];
            if (!book) return null;
            return (
              <div key={order.BookId} className='flex space-x-4 md:space-x-8 pb-4'>
                <div className='flex w-40 h-52 overflow-hidden border-[1px] border-gray-300 rounded-xl'>
                  <img src={book.bookCoverURL} alt={book.booktitle} className='w-full' />
                </div>
                <div className='flex flex-col justify-between mb-2'>
                  <div>
                    <Link to={`/book/${order.BookId}`}>
                      <h1 className='mt-1 text-2xl font-bold tracking-wider capitalize'>{book.booktitle}</h1>
                    </Link>
                    <h2 className='mt-1 text-lg font-semibold tracking-wider'>by {book.author}</h2>
                    <h2 className='mt-1 text-lg font-bold tracking-wider'>Price : {order.bookPrice} UGX</h2>
                  </div>
                  <div className='flex items-center space-x-6'>
                    <AverageRating bookId={order.BookId} />
                    <RateModal book={order} id={order.BookId} />
                  </div>
                  <div className='flex space-x-8'>
                    <div className='text-xl font-semibold flex items-center justify-center space-x-2'>
                      <span>Duration : </span>
                      <span className='font-extrabold'> {order.borrowTime} - {order.borrowTimePeriod} </span>
                    </div>
                    <div className='text-xl font-bold flex items-center justify-center space-x-2'>
                      <span className='text-green-700 font-bold tracki'>Returned </span>
                    </div>
                  </div>
                  <div className='flex flex-wrap space-x-6 items-center'>
                    <BorrowNowModal book={book} id={order.BookId} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooks;