import React, { useState } from 'react';
import { getDatabase, push, ref as ref_database, set } from 'firebase/database';
import CountryStateCity from '../components/CountryStateCity';
import PhoneNumberField from '../components/PhoneNumberField';
import toast, { Toaster } from 'react-hot-toast';
import Select from "react-select";
import {
    validateFirstName,
    validateLastName,
    validateAddress,
    validateEmail,
} from '../components/utils/validation';
import BackandHeading from '../components/header/BackandHeading';

const Donate = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        address: '',
        country: null,
        state: null,
        city: null,
        email: '',
        phoneNumber: '',
        donationType: null,
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
    });

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
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
    };


    const handlePhoneNumberChange = (phoneNumber) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            phoneNumber,
        }));
    };

    const handleDonationTypeChange = (selectedOption) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            donationType: selectedOption,
        }));
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
        const partnersRef = ref_database(db, 'donaters');
        const newPartnerRef = push(partnersRef);
        const timestamp = Date.now();
        const partnerData = {
            ...formData,
            timestamp,
        };
        set(newPartnerRef, partnerData)
            .then(() => {
                toast.success("We have received your request and we will contact you soon");
                // Clear form fields after successful submission
                setFormData({
                    firstName: '',
                    secondName: '',
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
            secondName: '',
            address: '',
            country: null,
            state: null,
            city: null,
            email: '',
            phoneNumber: '',
            donationType: null,
        });
    };

    const handleCountryStateCityChange = (country, state, city) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            country: country || null,
            state: state || null,
            city: city || null,
        }));
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? "1.5px solid rgb(156 163 175)" : "1.5px solid #ccc",
            borderRadius: "4px",
            boxShadow: "none",
            "&:hover": {
                cursor: "pointer",
            },
        }),
    };

    const DonationType = [
        { value: 'books', label: 'Books' },
        { value: 'cash', label: 'Cash' }
    ];


    const isFormValid =
        Object.values(formData).some((value) => value === '') ||
        !formData.country ||
        !formData.state ||
        !formData.donationType ||
        !formData.city;

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>
                <BackandHeading topHeading={'Donate'} />
                <div className=''>
                    <form className='w-full border-[1.5px] border-gray-300 px-6 pb-12 my-12 rounded-2xl space-y-6'>
                        <h1 className='font-bold tracking-wider text-2xl my-4 text-center px-20 mb-12'>Support Our Vision by donating a book or funds to build the African Resinance Library</h1>
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
                            <PhoneNumberField
                                phoneNumber={formData.phoneNumber}
                                onChange={handlePhoneNumberChange}
                            />
                            <div className='md:col-span-2'>
                                <Select
                                    className="w-full"
                                    styles={customStyles}
                                    value={formData.donationType}
                                    options={DonationType}
                                    onChange={handleDonationTypeChange}
                                    isClearable={true}
                                    placeholder="Donation Type"
                                    name='donationType'
                                />
                            </div>
                        </div>
                        <div className='flex justify-center space-x-12'>
                            <button type='reset' className='text-center px-14 py-2 rounded-3xl border-[1.5px] border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold text-xl' onClick={handleReset}>Cancel</button>
                            <button type='submit' className='text-center px-14 py-2 rounded-3xl bg-[#DE1212] disabled:bg-[#a44c4c] hover:bg-[#a20606] text-white font-semibold text-xl' onClick={handleSubmit} disabled={isFormValid}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Donate;
