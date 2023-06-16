import 'react-notifications/lib/notifications.css';
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Layout from './components/layout/Layout'
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Forgot from "./pages/auth/Forgot";
import ChangePassword from "./pages/auth/ChangePassword";
import About from "./pages/About";
import Partner from "./pages/Partner";
import Donate from "./pages/Donate";
import PageNotFound from "./pages/PageNotFound";
import ProfileUpdate from "./pages/ProfileUpdate";
import BorrowingPolicy from "./pages/BorrowingPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BookDonate from "./pages/BookDonate";
import Books from "./pages/Books";
import UploadBook from "./pages/UploadBook";
import Book from "./pages/Book";
import BookDetails from "./pages/BookDetails";
import Favorite from "./pages/Favorite";
import Cart from "./pages/Cart";
import MyBooks from "./pages/MyBooks";
import Notifications from "./pages/Notifications";
import Transation from './pages/Transation';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout><Home /></Layout>} />
      <Route path='/register' element={<Layout><Register /></Layout>} />
      <Route path='/login' element={<Layout><Login /></Layout>} />
      <Route path='/forgot-password' element={<Layout><Forgot /></Layout>} />
      <Route path='/change-password' element={<Layout><ChangePassword /></Layout>} />
      <Route path='/profile-update' element={<Layout><ProfileUpdate /></Layout>} />
      <Route path='/my-books' element={<Layout><MyBooks /></Layout>} />
      <Route path='/dashboard' element={<Layout><Dashboard /></Layout>} />
      <Route path='/favorites' element={<Layout><Favorite /></Layout>} />
      <Route path='/cart' element={<Layout><Cart /></Layout>} />
      <Route path='/notifications' element={<Layout><Notifications /></Layout>} />
      <Route path='/transations' element={<Layout><Transation /></Layout>} />
      <Route path='/about' element={<Layout><About /></Layout>} />
      <Route path='/partner' element={<Layout><Partner /></Layout>} />
      <Route path='/donate' element={<Layout><Donate /></Layout>} />
      <Route path='/book-donate' element={<Layout><BookDonate /></Layout>} />
      <Route path='/upload-book' element={<Layout><UploadBook /></Layout>} />
      <Route path='/upload-book/:BookId' element={<Layout><UploadBook /></Layout>} />
      <Route path='/books' element={<Layout><Books /></Layout>} />
      <Route path='/book-details' element={<Layout><BookDetails /></Layout>} />
      <Route path='/book/:id' element={<Layout><Book /></Layout>} />
      <Route path='/borrowing-policy' element={<Layout><BorrowingPolicy /></Layout>} />
      <Route path='/privacy-policy' element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path='/products' element={<Layout><Home /></Layout>} />
      <Route path='/product/:productId' element={<Layout><Home /></Layout>} />
      <Route path='/upload-products' element={<Layout><Home /></Layout>} />
      <Route path='/my-products' element={<Layout><Home /></Layout>} />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
    </>
  );
}

export default App;