import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AllRoutes from "./AllRoutes/AllRoutes";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./App.css";
import { Box } from "@chakra-ui/react";
import AdminLogin from "./Pages/admin/AdminLogin";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import Profile from "./Pages/MyAccount";
import Orders from "./Pages/OrderConfirmation";

// Import Admin Pages
import AdminDashboard from "./Pages/admin/AdminDashboard";
import ProductsPage from "./Pages/admin/ProductsPage";
import CategoriesPage from "./Pages/admin/CategoriesPage";
import UsersPage from "./Pages/admin/UsersPage";
import CommentsPage from "./Pages/admin/CommentsPage";
import ContactsPage from "./Pages/admin/ContactsPage";

// Import Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import PrivateRoute from "./components/auth/PrivateRoute";

// Import ProtectedRoute for authentication
import ProtectedRoute from "./PrivateRoute/ProtectedRoute";
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthToken } from './redux/selectors/authSelectors';
import { logout, initializeAuth } from './redux/slices/authSlice';
import { jwtDecode } from 'jwt-decode';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Token validation error:', error);
        dispatch(logout());
      }
    }
  }, [token, dispatch]);

  // Check if current path starts with /admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <Provider store={store}>
      <ChakraProvider>
        <ErrorBoundary>
          <PayPalScriptProvider options={{
            'client-id': PAYPAL_CLIENT_ID,
            currency: 'USD',
          }}>
            <Box className="App" minH="100vh" display="flex" flexDirection="column">
              {/* Only show navbar and footer for non-admin routes */}
              {!isAdminRoute && <Navbar />}
              <Box as="main" flex="1">
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin/products" element={
                    <ProtectedRoute requireAdmin={true}>
                      <ProductsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute requireAdmin={true}>
                      <CategoriesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requireAdmin={true}>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/comments" element={
                    <ProtectedRoute requireAdmin={true}>
                      <CommentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <ProtectedRoute requireAdmin={true}>
                      <ContactsPage />
                    </ProtectedRoute>
                  } />

                  {/* All other routes */}
                  <Route path="/*" element={<AllRoutes />} />
                </Routes>
              </Box>
              {!isAdminRoute && <Footer />}
            </Box>
          </PayPalScriptProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </Provider>
  );
};

export default App;