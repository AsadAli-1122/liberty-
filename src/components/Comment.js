import React, { useEffect, useState } from 'react';
import { getDatabase, off, onValue, ref } from 'firebase/database';
import { app } from '../context/firebase';
import { Rating } from '@mui/material';
import { formatDate } from './utils/Functions';

const Comment = ({ bookId }) => {
  const [ratingsData, setRatingsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [visibleReviews, setVisibleReviews] = useState(2); // Number of visible reviews
  const db = getDatabase(app);

  useEffect(() => {
    // Create a reference to the ratings data for the current book
    const ratingsRef = ref(db, `Ratings/${bookId}`);

    // Listen for changes in the ratings data
    const ratingsListener = onValue(ratingsRef, (snapshot) => {
      const ratingsData = snapshot.val();
      if (ratingsData) {
        const ratingsArray = Object.values(ratingsData);
        setRatingsData(ratingsArray);

        // Fetch user details for each rating
        ratingsArray.forEach((rating) => {
          const userRef = ref(db, `users/${rating.userId}`);
          onValue(userRef, (userSnapshot) => {
            const userData = userSnapshot.val();
            if (userData) {
              setUserData((prevUserData) => ({
                ...prevUserData,
                [rating.userId]: userData,
              }));
            }
          });
        });
      }
    });

    return () => {
      // Clean up the listener when the component unmounts or when the bookId changes
      off(ratingsRef, ratingsListener);

      // Reset the ratingsData and userData states
      setRatingsData([]);
      setUserData({});
    };
  }, [bookId, db]);

  const handleShowMoreReviews = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 2);
  };

  return (
    <div className="py-6">
      {ratingsData.length > 0 ? (
        ratingsData.slice(0, visibleReviews).map((rating) => (
          <div className="flex space-x-8" key={rating.userId}>
            <div>
              <div className="w-20 h-20 flex justify-center items-center overflow-hidden rounded-full">
                <img
                  src={userData[rating.userId]?.profile_picture || '/images/default-profile.jpg'}
                  alt="profile"
                  className="w-full"
                />
              </div>
            </div>
            <div className="w-full">
              <h1 className="text-xl font-bold tracking-wide">
                {userData[rating.userId]?.firstName && userData[rating.userId]?.lastName
                  ? `${userData[rating.userId].firstName} ${userData[rating.userId].lastName}`
                  : 'Unknown User'}
              </h1>
              <h1 className="font-semibold tracking-wide">{rating.description}</h1>
              <div className="flex items-center space-x-8 my-4">
                <Rating value={rating.rating} readOnly />
                <span className="font-bold tracking-wide border-l-[3px] border-slate-400 pl-8 text-black">
                  {formatDate(rating.time)}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className="font-semibold text-3xl text-center">No Reviews available.</h1>
      )}

      {/* Show More button */}
      {visibleReviews < ratingsData.length && (
        <button
          className="text-blue-500 underline mt-4"
          onClick={handleShowMoreReviews}
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default Comment;
