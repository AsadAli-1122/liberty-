import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref as ref_database, get, query, orderByChild, equalTo } from 'firebase/database';
import { app } from '../context/firebase';
import AverageRating from './AverageRating';
import { CircularProgress } from '@mui/material';

const RelatedBooks = ({ heading, field, innerField, value, slice, noBook }) => {
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(8);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      setLoading(true); 

      const db = getDatabase(app);
      const booksRef = ref_database(db, 'UploadBooks');

      let relatedBooksQuery;

      if (field && value) {
        if (innerField) {
          relatedBooksQuery = query(
            booksRef,
            orderByChild(`${field}/${innerField}`),
            equalTo(value)
          );
        } else {
          relatedBooksQuery = query(
            booksRef,
            orderByChild(field),
            equalTo(value)
          );
        }
      } else {
        relatedBooksQuery = booksRef;
      }

      const relatedBooksSnapshot = await get(relatedBooksQuery);
      const relatedBooksData = relatedBooksSnapshot.val();

      if (relatedBooksData) {
        const books = Object.keys(relatedBooksData).map(key => ({
          id: key,
          ...relatedBooksData[key]
        }));

        const slicedBooks = slice ? books.slice(0, slice) : books;

        setRelatedBooks(slicedBooks);
      }

      setLoading(false); 
    };

    fetchRelatedBooks();
  }, [field, innerField, value, slice]);

  const handleShowMore = () => {
    setVisibleBooks(prevVisibleBooks => prevVisibleBooks + 8);
  };

  const visibleBookList = relatedBooks.slice(0, visibleBooks);

  return (
    <div className='max-w-5xl mx-auto my-4'>
      {loading ? ( 
        <div className='flex justify-center items-center h-20'>
          <div className='loader'><CircularProgress color="inherit" /></div>
        </div>
      ) : relatedBooks && relatedBooks.length > 0 ? (
        <>
          <div>
            <div className='flex justify-between mb-3 my-6'>
              {heading && <h1 className='text-2xl font-bold tracking-wide capitalize'>{heading}</h1>}
              {slice && (
                <>
                  <div></div>
                  <Link
                    to={`/book-details?heading=${heading}&field=${field}&innerField=${innerField}&value=${value}`}
                    className="px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit"
                  >
                    View all
                  </Link>
                </>
              )}
            </div>

            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
              {visibleBookList.map(book => (
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
        <h1 className='max-w-5xl mx-auto text-2xl text-center'>No Book Available {noBook}</h1>
      )}
      {!slice && relatedBooks.length > visibleBooks && (
        <div className='flex justify-center items-center mt-4'>
          <button
            className='px-6 py-1 rounded-md border-[1.5px] border-[#DE1212] hover:border-[#a20606] text-[#DE1212] hover:text-[#a20606] font-semibold w-fit'
            onClick={handleShowMore}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedBooks;
