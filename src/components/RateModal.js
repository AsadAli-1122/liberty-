import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { AuthContext } from '../context/AuthContext';
import { getDatabase, ref, set, get } from 'firebase/database';
import { app } from '../context/firebase';
import { Rating } from '@mui/material';
import { validateRatingDescription } from '../components/utils/validation'

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
  flexDirection: 'column',
  paddingTop: '20px',
  paddingBottom: '25px',
};

export default function RateModal({ id, classes }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const { user } = React.useContext(AuthContext);
  const userId = user ? user.uid : null;
  const bookId = id;
  const db = getDatabase(app);

  const handleOpen = () => {
    if (!user) {
      console.log('Login first to review a book.');
      return;
    }
    if (userId && bookId) {
      setOpen(true);
    }
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const ordersRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
  
    // Check if the user has purchased the book
    get(ordersRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          alert('Please purchase the book first to write a review.');
          setOpen(false);
          return;
        }
  
        // Check if the user has already rated the book
        const ratingsRef = ref(db, `Ratings/${bookId}/${userId}`);
        get(ratingsRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              console.log('User has already rated this book.');
              setOpen(false);
              return;
            }
  
            // Validate the description
            const validationError = validateRatingDescription(description);
            if (validationError) {
              setErrorMessage(validationError);
              return;
            }
  
            // Save the rating details in the database
            set(ratingsRef, {
              rating: value,
              description: description,
              userId: userId,
              bookId: bookId,
              time: Date.now(),
            })
              .then(() => {
                console.log('Rating saved successfully.');
                setOpen(false);
              })
              .catch((error) => {
                console.error('Error saving rating:', error);
              });
          })
          .catch((error) => {
            console.error('Error checking rating existence:', error);
          });
      })
      .catch((error) => {
        console.error('Error checking book purchase:', error);
      });
  };
  

  return (
    <>
      <button onClick={handleOpen} className={`font-semibold text-md w-fit ${classes}`}>
        Write a Review
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center px-4">
            <h1 className="font-bold tracking-wider text-xl">Rate a Book</h1>
            <button onClick={handleClose} className="ml-4">
              <i className="fa-solid fa-circle-xmark text-gray-400 hover:text-gray-500 text-2xl"></i>
            </button>
          </div>
          <hr className="my-2 border-black w-full" />
          <div className="flex flex-col justify-center items-center px-4">
            <Rating
              name="simple-controlled"
              className="mt-2 mb-4"
              size="large"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
            <textarea
              name="message"
              id="message"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="resize-none border-[1.5px] border-gray-400 focus:border-gray-600 rounded-xl min-w-[330px] min-h-[100px] px-3 py-3 focus:outline-none focus:ring-0 mx-6"
            ></textarea>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <hr className="my-4 border-black w-full" />
          <div className="flex items-center justify-center">
            <button
              className="px-8 py-1 rounded-3xl bg-[#DE1212] disabled:bg-[#b76e6e] text-white hover:bg-[#910d0d] font-semibold w-fit"
              onClick={handleSubmit} disabled={!value}
            >
              Post
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
