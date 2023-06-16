import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneNumberField from '../components/PhoneNumberField';
import NationalIdNumber from '../components/NationalIdNumber';
import ProfilePicUpdate from '../components/ProfilePicUpdate';
import CountryStateCity from '../components/CountryStateCity';
import EmailField from '../components/Email';
import { AuthContext } from '../context/AuthContext';
import { getDatabase, ref as ref_database, update, get } from 'firebase/database';
import { getDownloadURL, getStorage, ref as ref_storage, uploadBytes } from 'firebase/storage';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { app } from '../context/firebase';
import toast, { Toaster } from 'react-hot-toast';


const ProfileUpdate = () => {
    const { user } = useContext(AuthContext);
    const db = getDatabase(app);
    const navigate = useNavigate();
    const storage = getStorage(app);
    const [nationalIdPicture, setNationalIdPicture] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setNationalIdPicture(file);
    };


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        nationalIdNumber: '',
        nationalIdPicture: null,
        country: null,
        state: null,
        city: null,
        zipCode: '',
        address1: '',
        address2: '',
    });

    const [locationData, setLocationData] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            const fetchUserData = async () => {
                try {
                    const userSnapshot = await get(ref_database(db, `users/${user.uid}`));

                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.val();
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            firstName: userData.firstName || '',
                            lastName: userData.lastName || '',
                            phoneNumber: userData.phoneNumber || '',
                            email: user.email || '',
                            isEmailVerified: user ? user.emailVerified : false,
                            nationalIdNumber: userData.nationalIdNumber || '',
                            country: userData.country || null,
                            state: userData.state || null,
                            city: userData.city || null,
                            zipCode: userData.zipCode || '',
                            address1: userData.address1 || '',
                            address2: userData.address2 || '',
                        }));

                        setLocationData({
                            country: userData.country || null,
                            state: userData.state || null,
                            city: userData.city || null,
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };

            fetchUserData();
        }
    }, [user, navigate, db]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneNumberChange = (phoneNumber) => {
        setFormData({ ...formData, phoneNumber });
    };

    const handleSendVerificationEmail = () => {
        sendEmailVerification(user)
            .then(() => {
                toast.success('Verification email sent successfully!');
            })
            .catch((error) => {
                toast.error('Failed to send verification email:', error);
            });
    };

    const handleNationalIdNumberChange = (nationalIdNumber) => {
        setFormData({ ...formData, nationalIdNumber });
    };

    const handleCountryStateCityChange = (country, state, city) => {
        setFormData({
            ...formData,
            country: country || null,
            state: state || null,
            city: city || null,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            nationalIdNumber: formData.nationalIdNumber,
            nationalIdPicture: formData.nationalIdPicture,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            zipCode: formData.zipCode,
            address1: formData.address1,
            address2: formData.address2,
        };

        try {
            await update(ref_database(db, `users/${user.uid}`), userData);

            await updateProfile(user, {
                displayName: formData.firstName + ' ' + formData.lastName,
                phoneNumber: formData.phoneNumber,
            });

            toast.success('User details updated successfully!');
        } catch (error) {
            toast.error('Failed to update user details:', error);
        }


        try {
            // Upload national ID picture to storage
            if (nationalIdPicture) {
                const fileName = `${user.uid}_${Date.now()}_${nationalIdPicture.name}`;
                const storageRef = ref_storage(storage, `users/national_id_pictures/${fileName}`);
                await uploadBytes(storageRef, nationalIdPicture);
                const downloadUrl = await getDownloadURL(storageRef);
                userData.nationalIdPicture = downloadUrl;
              }
        
            // Save user data to real-time database
            await update(ref_database(db, `users/${user.uid}`), userData);
        
            // ...existing code...
          } catch (error) {
            toast.error('Failed to update user details:', error);
          }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className='container mx-auto px-2 py-6 max-w-5xl space-y-6'>

                <div className='w-full flex justify-between items-center'>
                    <div>
                        <Link to='/'>
                            <i className='fa-solid fa-arrow-left text-3xl cursor-pointer'></i>
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold'>Profile Update</h1>
                    </div>
                </div>
                <div className=''>
                    <div className='w-full border-[1.5px] border-gray-300 px-6 py-12 my-12 rounded-2xl space-y-6'>
                        <ProfilePicUpdate />
                        <form
                            onSubmit={handleFormSubmit}
                            className='w-full space-y-6'
                        >
                            <h1 className='font-bold tracking-wider text-2xl my-4 px-12 mb-12'>Account Details</h1>
                            <div className='flex flex-col sm:flex-row space-x-8 px-12'>
                                <input
                                    type='text'
                                    onChange={handleInputChange}
                                    name='firstName'
                                    value={formData.firstName}
                                    className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                                    placeholder='First Name'
                                />
                                <input
                                    type='text'
                                    name='lastName'
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                                    placeholder='Last Name'
                                />
                            </div>
                            <div className='flex flex-col sm:flex-row space-x-8 px-12'>
                                <PhoneNumberField phoneNumber={formData.phoneNumber} onChange={handlePhoneNumberChange} />
                                <EmailField
                                    email={formData.email}
                                    isEmailVerified={formData.isEmailVerified}
                                    onSendVerificationEmail={handleSendVerificationEmail}
                                    onInputChange={handleInputChange}
                                />
                            </div>
                            <div className='flex flex-col sm:flex-row space-x-8 px-12'>
                                <NationalIdNumber value={formData.nationalIdNumber} onChange={handleNationalIdNumberChange} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="rounded-md border-[1.5px] border-slate-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full cursor-pointer"
                                    placeholder="National ID Picture"
                                />

                            </div>
                            <h1 className='font-bold tracking-wider text-2xl my-4 px-12 mb-12'>Address</h1>
                            <div className='grid grid-cols-2 gap-8 px-12'>
                                <CountryStateCity
                                    onChange={handleCountryStateCityChange}
                                    value={locationData}
                                />
                                <input
                                    type='number'
                                    onChange={handleInputChange}
                                    name='zipCode'
                                    value={formData.zipCode}
                                    className='rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full'
                                    placeholder='Zip-code'
                                />
                                <textarea
                                    name='address1'
                                    value={formData.address1}
                                    onChange={handleInputChange}
                                    className='resize-none rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full col-span-2'
                                    placeholder='Address 1'
                                    rows='1'
                                />
                                <textarea
                                    name='address2'
                                    value={formData.address2}
                                    onChange={handleInputChange}
                                    className='resize-none rounded-md border-gray-300 pl-4 py-2 placeholder:font-semibold font-semibold focus:ring-0 focus:outline-none focus:border-gray-400 w-full col-span-2'
                                    placeholder='Address 2'
                                    rows='1'
                                />
                            </div>
                            <div className='flex justify-center space-x-12'>
                                <button
                                    type='reset'
                                    className='text-center px-14 py-2 rounded-3xl border-[1.5px] border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold text-xl'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='text-center px-14 py-2 rounded-3xl bg-[#DE1212] hover:bg-[#a20606] text-white font-semibold text-xl'
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpdate;
