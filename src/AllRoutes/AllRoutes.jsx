// src/AllRoutes/AllRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Authentication from '../PrivateRoute/Authentication';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import MyAccount from '../Pages/MyAccount';

const AllRoutes = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default AllRoutes;