import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login.jsx";
import Signup from "./components/signup/Signup.jsx";
import Header from "./components/header/header.jsx";
import Index from "./components/index/index.jsx";
import UserDataChange from "./UserDataChange.jsx";
import React, { useState } from "react";
import AdminPage from "./components/admin/AdminPage.jsx";
import BookPage from "./components/bookpage/BookPage.jsx";
import Cart from "./components/cart/cart.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [categoryFilter, setCategoryFilter] = useState("Books");
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state

  return (
    <>
      <BrowserRouter>
        <Header
          setCategoryFilter={setCategoryFilter}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Index
                categoryFilter={categoryFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route
            path="/index"
            element={
              <Index
                categoryFilter={categoryFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userdatachange" element={<UserDataChange />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/bookpage" element={<BookPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
