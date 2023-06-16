import React, { useState } from 'react';
import { getDatabase, push, ref as ref_database, set } from 'firebase/database';
import CountryStateCity from '../components/CountryStateCity';
import PhoneNumberField from '../components/PhoneNumberField';
import toast, { Toaster } from 'react-hot-toast';
import {
  validateFirstName,
  validateLastName,
  validateAddress,
  validateEmail,
  validateMessage,
} from '../components/utils/validation';
import BackandHeading from '../components/header/BackandHeading';


const Partner = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: null,
    state: null,
    city: null,
    address: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    message: '',
  });

  const handleCountryStateCityChange = (country, state, city) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      country: country || null,
      state: state || null,
      city: city || null,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'firstName':
        errorMessage = validateFirstName(value);
        break;
      case 'lastName':
        errorMessage = validateLastName(value);
        break;
      case 'address':
        errorMessage = validateAddress(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'message':
        errorMessage = validateMessage(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };


  const handlePhoneNumberChange = (phoneNumber) => {
    setFormData({ ...formData, phoneNumber });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if there are any errors in the form fields
    const formErrors = Object.values(errors);
    if (formErrors.some((error) => error !== '')) {
      toast.error('Fix all errors to publish the book');
      return;
    }
  
    // Save partner data in Firebase Realtime Database with a new ID and Date.now() timestamp
    const db = getDatabase();
    const partnersRef = ref_database(db, 'partners');
    const newPartnerRef = push(partnersRef);
    const timestamp = Date.now();
    const partnerData = {
      ...formData,
      timestamp,
    };
    set(newPartnerRef, partnerData)
      .then(() => {
        toast.success("We have received your message and we will contact you soon");
        // Clear form fields after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          country: null,
          state: null,
          city: null,
          address: '',
          email: '',
          phoneNumber: '',
          message: '',
        });
      })
      .catch((error) => {
        toast.error('Failed send Message data:', error);
      });
  };
  

  const handleReset = () => {
    // Clear form fields when the "Cancel" button is clicked
    setFormData({
      firstName: '',
      lastName: '',
      country: null,
      state: null,
      city: null,
      address: '',
      email: '',
      phoneNumber: '',
      message: '',
    });
  };

  const isFormValid =
  Object.values(formData).some((value) => value === '') ||
  !formData.country ||
  !formData.state ||
  !formData.city;


  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>
        <BackandHeading topHeading={'Partner with Us'} />
        <div className=''>
          <h1 className='font-bold tracking-wider text-3xl'>African Resinance Library</h1>
          <p className='text-lg font-semibold my-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, libero nostrum omnis iusto corrupti pariatur, qui error tempore minus quidem porro cumque nihil! Numquam maiores obcaecati dolorem quibusdam totam harum excepturi natus illo, nisi ad vero doloribus sapiente ex in aperiam qui? Dolore voluptatem velit maxime ratione facere tempore, alias officia! Alias ducimus fuga quibusdam, perferendis possimus iure sunt libero totam magnam nulla delectus cum voluptatibus impedit dolores error at consequuntur ipsa animi dignissimos! </p>
          <form onSubmit={handleSubmit} className='w-full border-[1.5px] border-gray-300 px-6 pb-12 my-12 rounded-2xl space-y-6'>
            <h1 className='font-bold tracking-wider text-xl my-4'>Partner with us in pursuting this mission</h1>
            <div className='grid md:grid-cols-2 gap-8 px-12'>
              <div>
                <input
                  type="text"
                  name='firstName'
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='First Name'
                  onChange={handleInputChange}
                />
                {errors.firstName && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name='lastName'
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Last Name'
                  onChange={handleInputChange}
                />
                {errors.lastName && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.lastName}</p>}
              </div>
              <CountryStateCity
                onChange={handleCountryStateCityChange}
              />
              <div>
                <input
                  type="text"
                  name='address'
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Address'
                  onChange={handleInputChange}
                />
                {errors.address && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.address}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name='email'
                  className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Email Address'
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.email}</p>}
              </div>
              <PhoneNumberField phoneNumber={formData.phoneNumber} onChange={handlePhoneNumberChange} />
              <div className=' md:col-span-2'>
              <textarea
                type="text"
                name='message'
                className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full resize-none h-40 overflow-auto'
                placeholder='Message'
                onChange={handleInputChange}
                />
                {errors.message && <p className="text-sm font-semibold tracking-wider text-red-500 pl-2 mt-1">{errors.message}</p>}
                </div>
            </div>
            <div className='flex justify-center space-x-12'>
              <button type='reset' onClick={handleReset} className='text-center px-14 py-2 rounded-3xl border-[1.5px] border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold text-xl ' >Cancel</button>
              <button type='submit' className='text-center px-14 py-2 rounded-3xl bg-[#DE1212] hover:bg-[#a20606] disabled:bg-[#b67a7a] text-white font-semibold text-xl' disabled={isFormValid} >Submit</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Partner
