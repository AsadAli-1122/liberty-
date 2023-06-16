import React, { useState, useRef, useContext, useEffect } from 'react';
import { updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref as ref_storage, uploadBytes } from 'firebase/storage'
import { getDatabase, ref as ref_database, update } from "firebase/database";
import { app } from '../context/firebase';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';


const defaultPhotoURL = '/images/default_profile.avif';

const UpdateProfilePicture = () => {
  const { user, auth } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(user?.photoURL || defaultPhotoURL);
  const storage = getStorage(app);

  const fileInput = useRef(null);

  const handlePhotoUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  function updateProfilePicture(imageUrl) {
    const db = getDatabase(app);
    const currentUser = auth.currentUser;
    update(ref_database(db, `users/${currentUser.uid}`), { profile_picture: imageUrl })
      .then(() => {
        // console.log("Profile picture updated successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleUpdateProfilePic = (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    const fileName = currentUser.uid;
    const imageref = ref_storage(storage, `users/profile_pics/${fileName}`);

    uploadBytes(imageref, image)
      .then(() => {
        getDownloadURL(imageref)
          .then((url) => {
            updateProfile(currentUser, {
              photoURL: url,
            })
              .then(() => {
                updateProfilePicture(url);
                toast.success("Profile picture updated successfully");
                // window.location.reload();
              })
              .catch((error) => {
                console.log(error);
                toast.error("Error updating profile picture");
              });
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error updating profile picture");
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error updating profile picture");
      });
  };

  useEffect(() => {
    if (!user?.photoURL) {
      setUrl(defaultPhotoURL);
    }
  }, [user?.photoURL]);

  const handleCancel = () => {
    fileInput.current.value = null;
    setImage(null);
    setUrl(user?.photoURL || defaultPhotoURL);
  };

  return (
    <div className=''>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleUpdateProfilePic} className='flex flex-col items-center justify-between'>
        <div className='mb-3 w-60 h-60 flex justify-center items-center overflow-hidden rounded-full cursor-pointer shadow-md shadow-black' onClick={() => fileInput.current.click()}>
          <img src={url} alt='Profile' className='w-full' />
          <input type='file' onChange={handlePhotoUpload} ref={fileInput} style={{ display: 'none' }} />
        </div>
        <div className='flex space-x-6 items-center'>
          {image && (
            <button
              type='reset'
              className='text-center px-8 py-1 rounded-sm border-[1.5px] border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold'
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button
            type='submit'
            className='px-8 py-1 bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit whitespace-nowrap btn rounded-sm'
            disabled={!image}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfilePicture;
