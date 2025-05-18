import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login.jsx";
import Signup from "./components/signup/Signup.jsx";
import Index from "./components/index/index.jsx";
import UserDataChange from "./UserDataChange.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AdminPage from "./components/admin/AdminPage.jsx";
import BookPage from "./BookPage.jsx";
import Kosar from "./Kosar.jsx";
import Rendeles from "./Rendeles.jsx";
import Statistics from "./Statistics.jsx";
import Search from "./Search.jsx";

function App() {
  const [categoryFilter, setCategoryFilter] = useState("Books");
  const [searchQuery, setSearchQuery] = useState("");


  const [auth, setAuth] = useState(false); //ezt kellett beleirnom mert nelkule nem mukodott volna, meg ami alatta van
  const [admin, setAdmin] = useState(false);

  const handleDelete = () => {
    setAuth(false);
    setAdmin(false);
    console.log("User logged out");
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" sticky="top" className="custom-navbar">
        <Container>
          <Navbar.Brand href="/">Bookstore</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link href="/search">Keresés</Nav.Link>
            {auth ? (
              <Nav className="me-auto">
                {admin ? (
                  <>
                    <Nav.Link href="/adminpage">Book adding</Nav.Link>
                    <Nav.Link href="/statistics">Statisztikák</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/userdatachange">Profile settings</Nav.Link>
                    <Nav.Link href="/kosar">Kosár</Nav.Link>
                  </>
                )}
                <Button
                  className="search-btn"
                  type="submit"
                  onClick={handleDelete}
                >
                  Logout
                </Button>
              </Nav>
            ) : (
              <Nav className="me-auto">
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/signup">Signup</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Index
              categoryFilter={categoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userdatachange" element={<UserDataChange />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/bookpage" element={<BookPage />} />
          <Route path="/kosar" element={<Kosar />} />
          <Route path="/rendeles" element={<Rendeles />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;

