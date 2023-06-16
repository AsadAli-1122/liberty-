import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getDatabase, ref, set, child, get } from 'firebase/database';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid gray',
  borderRadius: '15px',
  boxShadow: 24,
  display: 'flex',
  paddingTop: '20px',
  paddingBottom: '25px',
  paddingLeft: '20px',
  paddingRight: '20px',
};

export default function BorrowNowModal({ book, id }) {
  const { user } = React.useContext(AuthContext);
  const userId = user ? user.uid : null;
  const bookId = id;
  const [open, setOpen] = React.useState(false);
  const [showBorrowNow, setShowBorrowNow] = React.useState(false);
  const [showBorrowAgain, setShowBorrowAgain] = React.useState(false);
  const [showExtendTime, setShowExtendTime] = React.useState(false);
  const navigate = useNavigate();
  const db = getDatabase();
  const cartsRef = ref(db, `Carts/${userId}/${bookId}`);
  const confirmOrdersRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(confirmOrdersRef);

        if (snapshot.exists()) {
          const orderData = snapshot.val();

          if (orderData.time) {
            setShowExtendTime(true);
            setShowBorrowAgain(false);
            setShowBorrowNow(false);
          } else {
            setShowBorrowAgain(true);
            setShowBorrowNow(false);
            setShowExtendTime(false);
          }
        } else {
          setShowBorrowNow(true);
          setShowBorrowAgain(false);
          setShowExtendTime(false);
        }
      } catch (error) {
        console.error('Error checking book details:', error);
      }
    };

    fetchData();
  }, [confirmOrdersRef]);

  const handleOpen = () => {
    setOpen(true);
    // Reset the state values
    setShowBorrowNow(false);
    setShowBorrowAgain(false);
    setShowExtendTime(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      console.error('Login first to add or remove books from your cart.');
      navigate('/login');
      return;
    }

    try {
      const snapshot = await get(child(cartsRef, 'bookId'));
      if (snapshot.exists()) {
        console.log('Book already in cart');
        setOpen(false);
      } else {
        await set(cartsRef, {
          bookId,
        });
        console.log('Book added to cart');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  const handleBorrowNow = async () => {
    if (!userId) {
      console.error('Login first to borrow books.');
      navigate('/login');
      return;
    }

    try {
      await set(cartsRef, {
        bookId,
      });
      console.log('Book borrowed');
      setOpen(false);
      navigate('/cart');
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };


  return (
    <>
      <button
        onClick={handleOpen}
        className={`px-8 py-1 rounded-3xl border-[1.5px] bg-[#DE1212] border-[#DE1212] hover:bg-[#980e0e] hover:border-[#980e0e] text-white font-semibold text-md w-fit`}
      >
        {showBorrowNow && !showBorrowAgain && !showExtendTime && 'Borrow Now'}
        {!showBorrowNow && showBorrowAgain && !showExtendTime && 'Borrow Again'}
        {!showBorrowNow && !showBorrowAgain && showExtendTime && 'Extend Time'}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='border-[1.5px] border-gray-400 rounded-md w-28 h-36 overflow-hidden flex justify-center items-center'>
            <img src={book.bookCoverURL} alt={book.booktitle} />
          </div>
          <div className='ml-4 mr-auto flex flex-col justify-between'>
            <div className='flex flex-col space-y-2'>
              <h1 className='text-2xl font-bold tracking-wider'>{book.booktitle}</h1>
              <h2 className='text-xl font-semibold tracking-wide'>UGX {book.price} / {book.borrowTime.label}</h2>
            </div>
            <div className='flex items-center space-x-6'>
              {showBorrowNow && (
                <button
                  className='px-8 py-1 rounded-3xl border-2 border-[#DE1212] hover:border-[#980e0e] bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold w-fit'
                  onClick={handleBorrowNow}
                >
                  {showBorrowAgain ? 'Borrow Again' : 'Borrow Now'}
                </button>
              )}
              {showBorrowAgain && (
                <button
                  className='px-8 py-1 rounded-3xl border-2 border-[#DE1212] hover:border-[#980e0e] bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold w-fit'
                  onClick={handleBorrowNow}
                >
                  {showBorrowNow ? 'Borrow Now' : 'Borrow Again'}
                </button>
              )}
              {showExtendTime && (
                <button
                  className='px-8 py-1 rounded-3xl border-2 border-[#DE1212] hover:border-[#980e0e] bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold w-fit'
                  onClick={handleBorrowNow}
                >
                  Extend Time
                </button>
              )}

              <button
                className='px-8 py-1 rounded-3xl border-2 border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold w-fit'
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div>
            <button onClick={handleClose} className='ml-4'>
              <i className="fa-solid fa-circle-xmark text-gray-400 hover:text-gray-500 text-2xl"></i>
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
