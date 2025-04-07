import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import MyAccount from "../Pages/MyAccount";
import Authentication from "../PrivateRoute/Authentication";
import AllProducts from "../Pages/AllProducts";

// Create this file if missing
const Home = () => <div>Welcome to our store!</div>; 

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route
        path="/account"
        element={
          <Authentication>
            <MyAccount />
          </Authentication>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AllRoutes;