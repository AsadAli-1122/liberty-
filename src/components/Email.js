import React from 'react';

const EmailField = ({ email, isEmailVerified, onSendVerificationEmail, onInputChange }) => {
  return (
    <div className='flex rounded-md border border-gray-300 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full overflow-hidden'>
      <input
        type='email'
        onChange={onInputChange}
        name='email'
        value={email}
        className='w-full pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 border-none disabled:bg-slate-200'
        placeholder='Email'
        disabled
      />
      {!isEmailVerified && (
        <div className='absolute px-3 text-xs text-[#DE1212] mt-10'>
          Your Email is not Verified
        </div>
      )}
      {!isEmailVerified && (
        <button
          onClick={onSendVerificationEmail}
          className='text-center bg-[#DE1212] hover:bg-[#a20606] px-4 text-white font-semibold text-xs py-1'
        >
          Verify Email
        </button>
      )}
    </div>
  );
};

export default EmailField;
