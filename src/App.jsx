import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Index from "./components/index/index.jsx";
import "./Home.css";
import Header from "./components/header/header.jsx";
import UserDataChange from "./UserDataChange.jsx";
import React from "react";
import AdminPage from "./AdminPage.jsx";
import BookPage from "./BookPage.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userdatachange" element={<UserDataChange />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/bookpage" element={<BookPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
