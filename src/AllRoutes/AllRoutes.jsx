import { Routes, Route } from 'react-router-dom';
import AllProducts from '../Pages/AllProducts';
import DescriptionPage from '../components/Description/DescriptionPage';
import Home from '../Pages/Home';
import Cart from '../Pages/Cart';
import ProtectedRoute from '../PrivateRoute/ProtectedRoute';
import MyAccount from '../Pages/MyAccount';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import AboutUs from '../Pages/AboutUs';
import Contact from '../Pages/Contact';
import Payment from '../Pages/Payment';

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/allproducts" element={<AllProducts />} />
      <Route path="/product/:productId" element={<DescriptionPage />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected User Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <MyAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:orderId"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AllRoutes;