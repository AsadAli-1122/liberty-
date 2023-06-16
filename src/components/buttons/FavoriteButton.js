import { getDatabase, push, ref, set, onValue, remove, off } from 'firebase/database';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { app } from '../../context/firebase';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const FavoriteButton = ({ id, bookName }) => {
    const { user } = useContext(AuthContext);
    const [isFavorited, setIsFavorited] = useState(false);
    const bookId = id;
    const userId = user ? user.uid : null;
    const navigate = useNavigate();
    const db = getDatabase(app);
    const favoritesRef = ref(db, 'Favorites');

    useEffect(() => {
        if (userId) {
            onValue(favoritesRef, (snapshot) => {
                const favorites = snapshot.val();
                if (favorites) {
                    const matchingFavorites = Object.entries(favorites).filter(
                        ([key, value]) => value.userId === userId && value.bookId === bookId
                    );
                    setIsFavorited(matchingFavorites.length > 0);
                    // console.log('Matching Favorites:', matchingFavorites.map(([key, value]) => key));
                } else {
                    setIsFavorited(false);
                }
            });
        }
    }, [userId, bookId, favoritesRef]);

    const handleFavorite = (e) => {
        e.preventDefault();
        if (!userId) {
            toast((t) => (
                <span className='flex justify-between items-center space-x-2'>
                    <span>
                        Login first to Add or Remove books in your Favorite list
                    </span>
                    <button onClick={() => toast.dismiss(t.id)} className='p-1 px-2 rounded-full border-2 border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold w-fit'>
                    <i className="fa-solid fa-xmark"></i>
                    </button>
                </span>
            ));
            navigate('/login');
            return;
        }
        setIsFavorited(true);

        const newFavoriteRef = push(favoritesRef);

        newFavoriteRef
            .then((snapshot) => {
                console.log(`Book ${bookName} Added in Favorite List`)
                return set(snapshot.ref, {
                    userId,
                    bookId,
                });
            })
            .catch((error) => {
                console.error('Error adding favorite:', error);
            });
    };

    const handleRemoveFavorite = (e) => {
        e.preventDefault();
        setIsFavorited(false);

        if (!userId) {
            toast((t) => (
                <span className='flex justify-between items-center space-x-2'>
                    <span>
                        Login first to Add or Remove books in your Favorite list
                    </span>
                    <button onClick={() => toast.dismiss(t.id)} className='p-1 px-2 rounded-full border-2 border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold w-fit'>
                    <i className="fa-solid fa-xmark"></i>
                    </button>
                </span>
            ));
            navigate('/login');
            return;
        }

        onValue(favoritesRef, (snapshot) => {
            const favorites = snapshot.val();
            if (favorites) {
                const matchingFavorites = Object.entries(favorites).filter(
                    ([key, value]) => value.userId === userId && value.bookId === bookId
                );
                if (matchingFavorites.length > 0) {
                    const matchedFavoriteId = matchingFavorites[0][0];

                    remove(ref(db, `Favorites/${matchedFavoriteId}`))
                        .then(() => {
                            console.log(`Book ${bookName} Removed in Favorite List`)
                            // Remove the listener after successful removal
                            off(favoritesRef);
                        })
                        .catch((error) => {
                            console.error('Error removing field from the database:', error);
                        });
                } else {
                    // Remove the listener if no matching favorite found
                    off(favoritesRef);
                }
            } else {
                // Remove the listener if favorites do not exist
                off(favoritesRef);
            }
        });
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            {isFavorited ? (
                <button
                    className="px-8 py-1 rounded-3xl border-[1.5px] bg-[#DE1212] border-[#DE1212] text-white font-bold text-md w-fit"
                    onClick={handleRemoveFavorite}
                >
                    Favorited
                </button>
            ) : (
                <button
                    className="px-8 py-1 rounded-3xl border-[1.5px] border-[#980e0e] hover:bg-[#DE1212] hover:border-[#DE1212] text-[#980e0e] hover:text-white font-bold text-md w-fit"
                    onClick={handleFavorite}
                >
                    Favorite
                </button>
            )}
        </>
    );
};

export default FavoriteButton;
