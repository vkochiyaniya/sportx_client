import { Routes, Route } from 'react-router-dom';
import AllProducts from '../Pages/AllProducts';
import DescriptionPage from '../components/Description/DescriptionPage';
import Home from '../Pages/Home';
import Cart from '../Pages/Cart';
import Authentication from '../PrivateRoute/Authentication';
import MyAccount from '../Pages/MyAccount';
import Login from '../Pages/Login';
import AboutUs from '../Pages/AboutUs';
import Contact from '../Pages/Contact';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/allproducts" element={<AllProducts />} />
      <Route path="/product/:productId" element={<DescriptionPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/account"
        element={
          <Authentication>
            <MyAccount />
          </Authentication>
        }
      />
      <Route path="/register" element={<Login />} />
    </Routes>
  );
};

export default AllRoutes;