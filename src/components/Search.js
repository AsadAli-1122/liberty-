import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../context/firebase';

const Search = ({ border }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get('title');
  const category = queryParams.get('category');
  const author = queryParams.get('author');
  const isbn = queryParams.get('isbn');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: title || '',
    category: category || '',
    author: author || '',
    isbn: isbn || '',
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [bookTitles, setBookTitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const booksRef = ref(db, 'UploadBooks');
      const snapshot = await get(booksRef);
      const data = snapshot.val();

      if (data) {
        const allCategories = Object.values(data).reduce((acc, book) => {
          if (book.category) {
            return [...acc, book.category];
          }
          return acc;
        }, []);
        const uniqueCategories = [...new Set(allCategories)];

        setCategories(
          uniqueCategories.map((category) => ({
            value: category,
            label: category,
          }))
        );

        const allAuthors = Object.values(data).reduce((acc, book) => {
          if (book.author) {
            return [...acc, book.author];
          }
          return acc;
        }, []);
        const uniqueAuthors = [...new Set(allAuthors)];

        setAuthors(
          uniqueAuthors.map((author) => ({
            value: author,
            label: author,
          }))
        );

        const allTitles = Object.values(data).reduce((acc, book) => {
          if (book.booktitle) {
            return [...acc, book.booktitle];
          }
          return acc;
        }, []);
        const uniqueTitles = [...new Set(allTitles)];

        setBookTitles(
          uniqueTitles.map((title) => ({
            value: title,
            label: title,
          }))
        );
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    // Select the book title option based on URL parameter
    if (title) {
      const selectedTitle = bookTitles.find((option) => option.value === title);
      if (selectedTitle) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: selectedTitle,
        }));
      }
    }
  
    // Select the category option based on URL parameter
    if (category) {
      const selectedCategory = categories.find((option) => option.value === category);
      if (selectedCategory) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          category: selectedCategory,
        }));
      }
    }
  
    // Select the author option based on URL parameter
    if (author) {
      const selectedAuthor = authors.find((option) => option.value === author);
      if (selectedAuthor) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          author: selectedAuthor,
        }));
      }
    }
  }, [ bookTitles, title, category, author, categories, authors ]);
  
  

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1.5px solid rgb(156 163 175)' : '1.5px solid #ccc',
      borderRadius: '4px',
      boxShadow: 'none',
      paddingTop: '2px',
      paddingBottom: '2px',
      width: '200px',
      '&:hover': {
        cursor: 'pointer',
      },
    }),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryValue = formData.category ? formData.category.value : null;
    const titleValue = formData.title ? formData.title.value : null;
    const authorValue = formData.author ? formData.author.value : null;
    const query = new URLSearchParams({
      ...formData,
      category: categoryValue,
      title: titleValue,
      author: authorValue,
    }).toString();
    navigate(`/book-details?${query}`);
  };

  const isFormEmpty = Object.values(formData).every((value) => value === '');

  return (
    <div className="mx-auto my-12 max-w-5xl">
      <form className={`my-8 mb-20 space-y-8 ${border} border-gray-400 py-8 rounded-2xl shadow shadow-gray-400`}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-4 px-4 max-w-4xl mx-auto">
          <Select
            className="w-fit"
            styles={customStyles}
            options={bookTitles}
            onChange={(selectedOption) => setFormData((prevFormData) => ({ ...prevFormData, title: selectedOption }))}
            isClearable={true}
            placeholder="Book title"
            name="title"
            value={formData.title}
          />
          <Select
            className="w-fit"
            styles={customStyles}
            options={categories}
            onChange={(selectedOption) => setFormData((prevFormData) => ({ ...prevFormData, category: selectedOption }))}
            isClearable={true}
            placeholder="Category"
            name="category"
            value={formData.category}
          />
          <Select
            className="w-fit"
            styles={customStyles}
            options={authors}
            onChange={(selectedOption) => setFormData((prevFormData) => ({ ...prevFormData, author: selectedOption }))}
            isClearable={true}
            placeholder="Author"
            name="author"
            value={formData.author}
          />
          <input
            type="text"
            name="isbn"
            className="rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-[200px]"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            className="px-20 py-2 rounded-3xl bg-[#DE1212] disabled:bg-[#ab4e4e] hover:bg-[#a20606] text-white font-semibold text-xl w-fit"
            onClick={handleSubmit}
            disabled={isFormEmpty}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;

