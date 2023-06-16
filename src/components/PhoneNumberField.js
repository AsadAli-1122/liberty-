//PhoneNumberField.js


import React, { useState } from 'react';
import Input from 'react-phone-number-input/input';

const PhoneNumberField = ({ phoneNumber, onChange }) => {
  // eslint-disable-next-line 
  const [value, setValue] = useState('');

  const handleInputChange = (phoneNumber) => {
    setValue(phoneNumber);
    if (onChange) {
      onChange(phoneNumber);
    }
  };

  return (
    <>
      <Input
        placeholder="Enter phone number"
        className='w-full rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400'
        value={phoneNumber}
        onChange={handleInputChange}
      />
    </>
  );
};

export default PhoneNumberField;
