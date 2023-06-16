import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BorrowButton = ({ id, bookName }) => {
  const { user } = useContext(AuthContext);
  const userId = user ? user.uid : null;
  const bookId = id;
  const navigate = useNavigate();
  const db = getDatabase();
  const cartsRef = ref(db, `Carts/${userId}/${bookId}`);

  useEffect(() => {}, []);

  const handleBorrow = async (e) => { 
    e.preventDefault();
    if (!userId) {
      toast((t) => (
        <span className='flex justify-between items-center space-x-2'>
          <span>Login first to add or remove books from your cart.</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className='p-1 px-2 rounded-full border-2 border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold w-fit'
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
        </span>
      ));
      navigate('/login');
      return;
    }

    try {
      const snapshot = await get(child(cartsRef, 'bookId')); // Check if the bookId already exists
      if (snapshot.exists()) {
        console.log('Book already in cart');
        // toast.error('This book is already in your cart.');
      } else {
        await set(cartsRef, {
          bookId,
        });
        console.log('Book added to cart');
        // toast.success('Book added to your cart.');
      }
    } catch (error) {
      console.error('Error adding book to cart:', error);
    //   toast.error('An error occurred while adding the book to your cart.');
    }
  };

  return (
    <button
      className='px-12 py-2 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-xl w-fit'
      onClick={handleBorrow}
    >
      Borrow Now
    </button>
  );
};

export default BorrowButton;
