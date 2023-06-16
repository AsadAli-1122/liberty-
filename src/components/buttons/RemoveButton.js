import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getDatabase, off, ref, remove, get } from 'firebase/database';
import { app } from '../../context/firebase';
import { useNavigate } from 'react-router-dom';

const RemoveButton = ({ id, bookName }) => {
  const { user } = useContext(AuthContext);
  const db = getDatabase(app);
  const cartRef = ref(db, `Carts/${user.uid}/${id}`);
  const navigate = useNavigate();

  const handleRemove = (e) => {
    e.preventDefault();

    remove(cartRef)
      .then(() => {
        console.log(`Book ${bookName} Removed in Favorite List`);
        // Remove the listener after successful removal
        off(cartRef);

        // Check if the cart is empty
        get(ref(db, `Carts/${user.uid}`)).then((snapshot) => {
          const cartData = snapshot.val();
          if (!cartData) {
            // If cart is empty, navigate to the homepage
            navigate('/');
          }
        });
      })
      .catch((error) => {
        console.error('Error removing field from the database:', error);
      });
  };

  return (
    <button
      onClick={handleRemove}
      className="rounded-md border-[1.5px] border-gray-400 px-3 py-1 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 w-fit space-x-2 flex items-center"
    >
      <i className="fa-solid fa-trash text-gray-500 text-xl"></i>
      <span>Remove</span>
    </button>
  );
};

export default RemoveButton;
