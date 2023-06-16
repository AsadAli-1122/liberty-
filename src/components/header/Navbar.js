import React, { useContext } from 'react'
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificatonDropdown';
import CartDropdown from './CartDropdown';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { Toaster, toast } from 'react-hot-toast';
// import LanguageSwitcher from '../LanguageSwitcher';


export default function Navbar() {
    const { user, auth } = useContext(AuthContext);
    const navigate = useNavigate();


    const LinkClass = "hover:bg-white hover:bg-opacity-20 w-[90%] mx-auto px-10 py-2 rounded-md flex justify-start  tems-center space-x-6"
    const ActiveLinkClass = "bg-gray-300 bg-opacity-20 w-[90%] mx-auto px-10 py-2 rounded-md flex justify-start items-center space-x-6"

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/');
                toast.success('Logout successful');
            })
            .catch((error) => {
                toast.error('Logout Error:', error);
            });
    }

    // Check user role
    const isAdmin = user && user.userData && user.userData.role === 'admin';

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className=''>
                <nav className="navbar md:px-8 max-w-6xl mx-auto ">
                    <div className="container-fluid">
                        <div className='d-flex flex-row'>
                            <button className="navbar-toggler-cs mx-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLightNavbar" aria-controls="offcanvasLightNavbar" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon text-dark"></span>
                            </button>
                            <div className='flex justify-center items-center overflow-hidden w-12'>
                                <NavLink to='/'>
                                    <img src="/images/logo_size.jpg" alt="liberty" className='hidden sm:block' />
                                </NavLink>
                            </div>
                        </div>

                        <div className='flex justify-center items-center space-x-2'>
                            {/* <LanguageSwitcher /> */}
                            {user && <NotificationDropdown />}
                            {user && <CartDropdown />}
                            <ProfileDropdown />
                            <NavLink to='/book-donate' className="px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit" >Donate a Book</NavLink>
                        </div>
                    </div>
                    <div className="offcanvas offcanvas-start bg-[#666666] text-white max-w-xs overflow-scroll" tabIndex="-1" id="offcanvasLightNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                        <div>
                            {user &&
                                <>
                                    <div className='flex justify-center items-center mx-auto bg-white w-60 h-60 rounded-full overflow-hidden mt-16 mb-8'>
                                        <Link to='/profile-update' className='w-full'>
                                            <img className='w-full' src={user.photoURL || "/images/default_profile.avif"} alt={`Profile_${user.displayName}`} />
                                        </Link>
                                    </div>
                                    <div className='mx-auto mb-4'>
                                        <h3 className='text-center font-bold text-3xl capitalize'>{user.displayName}</h3>
                                        <h5 className='text-center font-normal text-xl'>{user.email}</h5>
                                        <h6 className='text-center font-light text-xl'>{user.phoneNumber}</h6>
                                    </div>
                                    <div className='flex flex-col text-left space-y-2'>
                                        
                                        {isAdmin ? (
                                            <>
                                            <NavLink to='/dashboard' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)} >
                                            <i className="fa-solid fa-chart-simple"></i>
                                            <span>Dashboard</span>
                                        </NavLink>
                                                <NavLink to='/upload-book' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)} >
                                                    <i className="fa-solid fa-chart-simple"></i>
                                                    <span>Upload Book</span>
                                                </NavLink>
                                            </>
                                        ) : (
                                            <>
                                            <NavLink to='/' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)} >
                                            <i className="fa-solid fa-chart-simple"></i>
                                            <span>Dashboard</span>
                                        </NavLink>
                                            </>
                                        )}
                                        <NavLink to='/my-books' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                            <i className="fa-solid fa-newspaper"></i>
                                            <span>My Library</span>
                                        </NavLink>
                                        <button className="flex flex-row justify-between px-8 py-1 bg-black bg-opacity-30" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1" aria-expanded="false" aria-controls="multiCollapseExample1"><span className=''>General</span><i className="fa-solid fa-caret-down pt-1"></i></button>
                                        <div className="flex flex-col text-left space-y-2" >
                                            <NavLink to='/favorites' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-book-bookmark"></i>
                                                <span>Favorites</span>
                                            </NavLink>
                                            <NavLink to='/cart' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-cart-shopping"></i>
                                                <span>Cart</span>
                                            </NavLink>
                                            <NavLink to='/transations' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-file-invoice"></i>
                                                <span>Transaction History</span>
                                            </NavLink>
                                            <NavLink to='/change-password' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-unlock-keyhole"></i>
                                                <span>Change Password</span>
                                            </NavLink>
                                            <NavLink to='/borrowing-policy' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-circle-info"></i>
                                                <span>Terms & Conditions</span>
                                            </NavLink>
                                            <NavLink to='/privacy-policy' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-shield"></i>
                                                <span>Privacy Policy</span>
                                            </NavLink>
                                            <button onClick={handleLogout} className='hover:bg-white hover:bg-opacity-20 w-[90%] mx-auto px-10 py-2 rounded-md flex justify-start items-center space-x-6'>
                                                <i className="fa-solid fa-right-from-bracket"></i>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                        <button className="flex flex-row justify-between px-8 py-1 bg-black bg-opacity-30" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2"><span className=''>Renaissance Library</span><i className="fa-solid fa-caret-down pt-1"></i></button>
                                        <div className="flex flex-col text-left space-y-2 pb-24" >
                                            <NavLink to='/about' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-book-open-reader"></i>
                                                <span>About Us</span>
                                            </NavLink>
                                            <NavLink to='/partner' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-thumbs-up"></i>
                                                <span>Patner With Us</span>
                                            </NavLink>
                                            <NavLink to='/donate' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                                <span>Donate With Us</span>
                                            </NavLink>
                                        </div>

                                    </div>
                                </>
                            }
                            {!user &&
                                <>
                                    <div className='flex justify-center items-center mx-auto bg-white w-60 h-60 rounded-full overflow-hidden mt-16 mb-8'>
                                        <img className='' src="/images/default_profile.avif" alt="profile" width='100%' />
                                    </div>
                                    <div className='mx-auto mb-4'>
                                        <h3 className='text-center font-bold text-3xl capitalize'>Guest</h3>
                                    </div>
                                    <div className='flex flex-col text-left space-y-2'>

                                        <button className="flex flex-row justify-between px-8 py-1 bg-black bg-opacity-30" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1" aria-expanded="false" aria-controls="multiCollapseExample1"><span className=''>General</span><i className="fa-solid fa-caret-down pt-1"></i></button>
                                        <div className="flex flex-col text-left space-y-2" >
                                            <NavLink to='/' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-house"></i>
                                                <span>Home</span>
                                            </NavLink>
                                            <NavLink to='/register' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-user-plus"></i>
                                                <span>Register</span>
                                            </NavLink>
                                            <NavLink to='/login' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                                <span>Login</span>
                                            </NavLink>
                                        </div>
                                        <button className="flex flex-row justify-between px-8 py-1 bg-black bg-opacity-30" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2"><span className=''>Renaissance Library</span><i className="fa-solid fa-caret-down pt-1"></i></button>
                                        <div className="flex flex-col text-left space-y-2 pb-24" >
                                            <NavLink to='/about' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-book-open-reader"></i>
                                                <span>About Us</span>
                                            </NavLink>
                                            <NavLink to='/partner' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-thumbs-up"></i>
                                                <span>Patner With Us</span>
                                            </NavLink>
                                            <NavLink to='/donate' className={({ isActive }) => (isActive ? ActiveLinkClass : LinkClass)}>
                                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                                <span>Donate With Us</span>
                                            </NavLink>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}
