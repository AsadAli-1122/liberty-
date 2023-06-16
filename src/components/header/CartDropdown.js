import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue, off, remove } from 'firebase/database';
import { AuthContext } from '../../context/AuthContext';
import { app } from '../../context/firebase';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line 
  const [timeSelect, setTimeSelect] = useState({});
  const [matchedBooks, setMatchedBooks] = useState([]);
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const db = getDatabase(app);

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

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        setMatchedBooks([]);
        return;
      }
    
      const cartRef = ref(db, `Carts/${user.uid}`);
      const cartListener = onValue(cartRef, (snapshot) => {
        const cartData = snapshot.val();
        if (cartData) {
          fetchMatchedBooks(db, cartData);
        } else {
          setMatchedBooks([]); // Clear the matchedBooks array if cartData is empty
        }
      });
      return () => {
        off(cartRef, cartListener);
      };
    };

    fetchCartItems();
  }, [user, db]);

  const fetchMatchedBooks = (db, cartData) => {
    const booksRef = ref(db, 'UploadBooks');
    const booksListener = onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      if (booksData) {
        const matchedBooks = Object.entries(booksData)
          .filter(([bookId, bookData]) => cartData.hasOwnProperty(bookId))
          .map(([bookId, bookData]) => ({ ...bookData, id: bookId }));
        setMatchedBooks(matchedBooks);

        const initialTimeSelect = matchedBooks.reduce((acc, book) => {
          acc[book.id] = 1;
          return acc;
        }, {});
        setTimeSelect(initialTimeSelect);
      }
    }, (error) => {
      console.log('Error fetching books:', error);
    });

    return () => {
      off(booksRef, booksListener);
    };
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };


  const handleRemove = ({ uid, id }) => {
    const cartRef = ref(db, `Carts/${uid}/${id}`);
    remove(cartRef)
      .then(() => {
        console.log(`Book ${id} Removed in Favorite List`);
        // Remove the listener after successful removal
        off(cartRef);
  
        // Remove the book from the matchedBooks array
        setMatchedBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        
        
        // Check if it's the last book and close the dropdown
        if (matchedBooks.length === 1) {
          closeDropdown();
        }
      })
      .catch((error) => {
        console.error('Error removing field from the database:', error);
      });
  };
  
  


  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none"
        onClick={toggleDropdown}
      >
        <i className="fa-solid fa-shopping-cart text-black"></i>
        {matchedBooks.length > 0 ? <span className='absolute -mt-6 -mr-6 bg-red-600 rounded-full text-white w-5 h-5 flex justify-center items-center text-xs' >{matchedBooks.length}</span> : ''}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="cart-menu">
            <span className="block text-xl font-semibold text-gray-700 hover:bg-gray-100 text-center my-2 border-b-2 pb-2 border-gray-300" role="menuitem">
              Cart
            </span>
            <div className=' max-h-72 overflow-scroll '>

            {matchedBooks.length > 0 ? (
              matchedBooks.map((item) => (
                <div key={item.id} className="flex space-x-4 px-4 w-full mb-1" role="menuitem">
                  <div className='flex h-16 w-10 overflow-hidden border-[1px] border-gray-300 rounded-md'>
                    <img src={item.bookCoverURL} alt={item.booktitle} className='w-full' />
                  </div>
                  <div className='w-40'>
                    {item.booktitle}
                  </div>
                  <button onClick={() => handleRemove({ uid: user.uid, id: item.id })} className=''>
                    <i className="fa-solid fa-trash text-gray-500"></i>
                  </button>
                </div>
              ))
              ) : (
                <div className="block px-4 text-sm text-gray-700 hover:bg-gray-100 text-center py-4" role="menuitem">
                No items in the cart
              </div>
            )}
            </div>
            <span className="block text-sm text-gray-700 hover:bg-gray-100 text-center my-2 border-t-2 pt-2 border-gray-300">
              <Link to="/cart" className="px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit" onClick={closeDropdown}>
                View All
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
