import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.get("https://localhost:7214/api/AdminControllers/Admin");
      const admin = res.data.find(
        (a) => a.email === email && a.password === password
      );

      if (admin) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      } else {
        alert("Invalid admin credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
