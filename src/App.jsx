import React from "react";
import { Routes, Route } from "react-router-dom";
import AllRoutes from "./AllRoutes/AllRoutes";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import "./App.css";
import { Box } from "@chakra-ui/react";
import AdminLogin from "./Pages/admin/AdminLogin";

// Import Admin Pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import ProductsPage from "./Pages/admin/ProductsPage";
import CategoriesPage from "./Pages/admin/CategoriesPage";
import UsersPage from "./Pages/admin/UsersPage";
import CommentsPage from "./Pages/admin/CommentsPage";
import ContactsPage from "./Pages/admin/ContactsPage";

// Import AdminRoute for protected admin routes
import AdminRoute from "./PrivateRoute/AdminRoute";

function App() {
  // Check if current path starts with /admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <Box className="App" minH="100vh" display="flex" flexDirection="column">
        {/* Only show navbar and footer for non-admin routes */}
        {!isAdminRoute && <Navbar />}
        <Box as="main" flex="1">
          <Routes>
            {/* Admin Routes with AdminRoute protection */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/products" element={
              <AdminRoute>
                <ProductsPage />
              </AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute>
                <CategoriesPage />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            } />
            <Route path="/admin/comments" element={
              <AdminRoute>
                <CommentsPage />
              </AdminRoute>
            } />
            <Route path="/admin/contacts" element={
              <AdminRoute>
                <ContactsPage />
              </AdminRoute>
            } />
            
            {/* Customer Routes */}
            <Route path="/*" element={<AllRoutes />} />
          </Routes>
        </Box>
        {!isAdminRoute && <Footer />}
      </Box>
    </ErrorBoundary>
  );
}

export default App;