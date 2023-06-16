import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDatabase, ref as ref_database, get, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { app } from '../context/firebase';
import CategoryButtons from '../components/CategoryButtons';
import BackandHeading from '../components/header/BackandHeading';
import FavoriteButton from '../components/buttons/FavoriteButton';
import BorrowNowModal from '../components/BorrowNowModal';
import AverageRating from '../components/AverageRating';
import RateModal from '../components/RateModal';
import Comment from '../components/Comment';
import { CircularProgress } from '@mui/material';

const Book = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [sameAuthor, setSameAuthor] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const db = getDatabase(app);
        const bookRef = ref_database(db, `UploadBooks/${id}`);
        const sameAuthorRef = ref_database(db, 'UploadBooks');

        const fetchBook = async () => {
            const bookSnapshot = await get(bookRef);
            const bookData = bookSnapshot.val();

            if (bookData) {
                const userSnapshot = await get(ref_database(db, `users/${bookData.UserUid}`));
                const user = userSnapshot.val();
                const bookWithUser = {
                    id,
                    ...bookData,
                    user: user ? user.firstName + ' ' + user.lastName : 'Unknown User',
                    email: user ? user.email : 'Unknown Email',
                };
                setBook(bookWithUser);
            }
        };

        fetchBook();

        const sameAuthorQuery = query(
            sameAuthorRef,
            orderByChild('author'),
            equalTo(book?.author || '')
        );

        onValue(sameAuthorQuery, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const bookList = Object.keys(data)
                    .filter((key) => key !== id) // Exclude current book
                    .map(async (key) => {
                        const bookData = data[key];
                        const userSnapshot = await get(ref_database(db, `users/${bookData.UserUid}`));
                        const user = userSnapshot.val();
                        const bookWithUser = {
                            id: key,
                            ...bookData,
                            user: user ? user.firstName + ' ' + user.lastName : 'Unknown User',
                            email: user ? user.email : 'Unknown Email',
                        };
                        return bookWithUser;
                    });
                Promise.all(bookList).then((completedBooks) => {
                    setSameAuthor(completedBooks);
                });
            }
        });
    }, [id, book]);

    if (!book) {
        return <div className='flex justify-center items-center h-20'>
        <div className='loader'><CircularProgress color="inherit" /></div>
      </div>;
    }

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const truncateDescription = (description, maxWords) => {
        const words = description.split(' ');
        if (words.length <= maxWords) {
            return description;
        }
        const truncatedWords = words.slice(0, maxWords);
        return truncatedWords.join(' ') + '...';
    };

    const renderDescription = () => {
        if (!book.description) {
            return null;
        }
        if (expanded) {
            return <span>{book.description}</span>;
        } else {
            const truncatedDescription = truncateDescription(book.description, 20);
            return <span>{truncatedDescription}</span>;
        }
    };

    const renderToggleButton = () => {
        if (!book.description) {

            return null;
        }
        if (expanded) {
            return <button onClick={toggleDescription} className='text-xl font-semibold tracking-wider text-red-600'>Read Less</button>;
        } else {
            return <button onClick={toggleDescription} className='text-xl font-semibold tracking-wider text-red-600'>Read More</button>;
        }
    };

    

    return (
        <div className='container mx-auto px-2 py-6 max-w-5xl min-h-screen space-y-6'>
            <BackandHeading topHeading={book.booktitle} />
            <div className='flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8'>
                <div className='flex justify-center items-center w-[320px] h-[350px] overflow-hidden border-2 border-gray-300 rounded-xl mx-auto'>
                    <Link to={book.bookCoverURL} target="_blank" className='w-full'>
                        <img src={book.bookCoverURL} alt={book.booktitle} className='w-full' />
                    </Link>
                </div>
                <div className='w-full space-y-2 flex flex-col justify-center'>
                    <div className='flex items-center justify-between'>
                        <h1 className='my-2 text-4xl font-bold tracking-wider capitalize'>{book.booktitle}</h1>
                        {/* <EditButton id={book.id} /> */}
                    </div>
                    <h2 className='my-2 text-2xl font-semibold tracking-wider'>by <span className='capitalize'>{book.author}</span> </h2>
                    <AverageRating size={'large'} bookId={id} />
                    <h1 className='my-2 text-2xl font-semibold tracking-wider'>UGX {book.price} / {book.borrowTime.label}</h1>
                    <h2 className='my-2 text-2xl font-semibold tracking-wider'>Status : {book.quantity > 0 ? <span className='font-bold text-green-500'>Available</span> : <span className='font-bold text-red-500'>Not Available</span>}</h2>
                    <div className='space-x-8'>
                        <BorrowNowModal book={book} id={book.id} />
                        <FavoriteButton id={id} bookName={book.booktitle} />
                    </div>
                </div>
            </div>
            <div>
                <div className='overflow-hidden'>
                    <span className='text-2xl font-bold tracking-wider'>The Startup Owner's Manual </span>
                    <span className='text-lg font-semibold tracking-wide'>{renderDescription()}</span>

                </div>
                {renderToggleButton()}
            </div>
            <div>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-bold tracking-wide'>Top Reviews</h1>
                    <RateModal classes={'px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit'} id={id} />
                </div>
                <Comment bookId={id} />
            </div>
            <div>
                {sameAuthor && sameAuthor.length > 0 ? (
                    <>
                        <div>
                            <CategoryButtons />
                            <div className='flex justify-between mb-8'>
                                <h1 className='text-2xl font-bold tracking-wide'>You may also like</h1>
                                <Link to={`/book-details?author=${book.author}`} className="px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit">View all</Link>
                            </div>
                            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>

                                {sameAuthor.slice(0, 4).map((book) => (
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
                                        <AverageRating bookId={book.id} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <h1 className='max-w-5xl mx-auto text-2xl text-center'>No More books available of this Author</h1>
                )}

            </div>
        </div>
    );
};

export default Book;

