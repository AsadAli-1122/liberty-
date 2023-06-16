import React from 'react';

const NationalIdNumber = ({ value, onChange }) => {
  const handleNationalIdNumberChange = (e) => {
    const input = e.target.value;
    const formattedID = formatID(input);
    onChange(formattedID);
  };

  const formatID = (value) => {
    const onlyNumbers = value.replace(/\D/g, '');
    const formattedValue =
      onlyNumbers.substring(0, 5) +
      '-' +
      onlyNumbers.substring(5, 12) +
      '-' +
      onlyNumbers.substring(12, 13);
    return formattedValue;
  };

  return (
    <input
      className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
      id='national-id-number'
      type='text'
      value={value}
      name='NationalIDNumber'
      aria-label='Please enter your National ID number'
      placeholder='National ID Number'
      onChange={handleNationalIdNumberChange}
    />
  );
};

export default NationalIdNumber;
