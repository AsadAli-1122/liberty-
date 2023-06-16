export const validateBookTitle = (bookTitle) => {
  if (!bookTitle) {
    return 'Book title is required.';
  }
  
  const wordCount = bookTitle.trim().split(/\s+/).length;
  if (wordCount < 1 || wordCount > 8) {
    return 'Book title must be between 1 and 8 words.';
  }
  
  return '';
};


export const validateCategory = (catogery) => {
  if (!catogery) {
    return 'Category is required.';
  }

  const wordCount = catogery.trim().split(/\s+/).length;
  if (wordCount !== 1) {
    return 'Book title must be 1 word.';
  }

  return '';
};

export const validateAuthor = (author) => {
  if (!author) {
    return 'Author is required.';
  }

  const wordCount = author.trim().split(/\s+/).length;
  if (wordCount < 1 || wordCount > 4) {
    return 'Author must be between 1 and 4 words.';
  }

  return '';
};

export const validateQuantity = (value) => {
  const quantity = parseInt(value, 10);
  if (!quantity) {
    return 'Quantity is required.';
  }
  if (isNaN(quantity) || quantity < 30 || quantity > 9999) {
    return 'Quantity must be between 30 and 9999.';
  }
  return '';
};

export const validatePrice = (value) => {
  const price = parseInt(value, 10);
  if (!price) {
    return 'Price is required.';
  }
  if (isNaN(price) || price < 99 || price > 9999) {
    return 'Price must be between 99 and 9999.';
  }
  return '';
};

export const validateISBN = (isbn) => {
  if (!isbn) {
    return 'ISBN Number is required.';
  }
  if (isbn.length < 10 || isbn.length > 13) {
    return 'ISBN Number must be between 10 and 13 Digits.';
  }
  return '';
};

export const validateDescription = (description) => {
  if (!description) {
    return 'Description is required.';
  }
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount < 80 || wordCount > 100) {
    return 'Description must be between 80 to 100 words.';
  }
  return '';
};


export const validateBorrowTime = (value) => {
  if (!value) {
    return 'Borrowing Time is required.';
  }
  return '';
};

export const validateType = (value) => {
  if (!value) {
    return 'Type is required.';
  }
  return '';
};

export const validateFirstName = (value) => {
  const regex = /^[a-zA-Z\s]{3,20}$/;
  if(!value){
    return 'First Name is required.';
  }
  if (!regex.test(value)) {
    return 'Name should be between 3 and 20 characters.';
  }
  return '';
};

export const validateLastName = (value) => {
  const regex = /^[a-zA-Z\s]{3,20}$/;
  if(!value){
    return 'Last Name is required.';
  }
  if (!regex.test(value)) {
    return 'Name should be between 3 and 20 characters.';
  }
  return '';
};

export const validateAddress = (value) => {
  if (!value) {
    return 'Address is required.';
  }
  if (value.length < 10 || value.length > 50) {
    return 'Address must be between 10 and 50 characters long.';
  }
  return '';
};

export const validateEmail = (value) => {
  if (!value) {
    return 'Email address is required.';
  }
  if (!value.includes('@')) {
    return 'Email address must contain the @ symbol.';
  }
  if (value.length > 35) {
    return 'Email address must be a maximum of 35 characters long.';
  }
  return '';
};

export const validateMessage = (message) => {
  if (!message) {
    return 'Message is required.';
  }
  
  const wordCount = message.trim().split(/\s+/).length;
  if (wordCount < 3) {
    return 'Message must have a minimum of 3 words.';
  }
  if (wordCount > 50) {
    return 'Message must have a maximum of 50 words.';
  }
  
  if (message.length > 500) {
    return 'Message must be less than 500 characters.';
  }
  
  return '';
};


export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password) {
    return 'Password is required.';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least 8 characters including an uppercase letter, lowercase letter, number, and special character.';
  }
  return '';
};

export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) {
    return 'Confirm Password is required.';
  }
  if (confirmPassword !== password) {
    return 'Confirm Password must match the Password.';
  }
  return '';
};


export const validateRatingDescription = (message) => {
  if (!message) {
    return 'Message is required.';
  }
  
  const wordCount = message.trim().split(/\s+/).length;
  if (wordCount < 5) {
    return 'Message must have a minimum of 5 words.';
  }
  if (wordCount > 20) {
    return 'Message must have a maximum of 20 words.';
  }
  
  if (message.length > 100) {
    return 'Message must be less than 100 characters.';
  }
  
  return '';
};