// src/App.jsx
import React from "react";
import AllRoutes from "./AllRoutes/AllRoutes";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box className="App" minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex="1" py={8}>
        <AllRoutes />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;