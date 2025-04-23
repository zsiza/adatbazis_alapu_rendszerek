import {BrowserRouter, Routes, Route, redirect} from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home.jsx";
import "./Home.css";
import Header from "./components/header/header.jsx";
import UserDataChange from "./UserDataChange.jsx";
import React, {useEffect} from "react";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AdminPage from "./AdminPage.jsx";

function App() {
    const [auth, setAuth] = React.useState(false);
    const [admin, setAdmin] = React.useState(false);

    const handleDelete = () => {
        axios.get("http://localhost:8081/logout")
            .then((res) => {
                if (res.data.Status === "Success") {
                    location.reload(true);
                }
            }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get("http://localhost:8081")
            .then((res) => {
                console.log(res);
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setAdmin(res.data.admin);
                    console.log(res.data.email);
                } else {
                    setAuth(false);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

  return (
    <>
        {
            <>
                <Navbar
                    collapseOnSelect
                    expand="lg"
                    sticky="top"
                    className="custom-navbar"
                >
                    <Container>
                        <Navbar.Brand href="/">Bookstore</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            {
                                auth ?
                                    <Nav className="me-auto">
                                        {
                                            admin ?
                                                <Nav.Link href="/adminpage">Book adding</Nav.Link>
                                                :
                                                <Nav.Link href="/userdatachange">Profile settings</Nav.Link>
                                        }
                                        <Button className="search-btn" type="submit" onClick={handleDelete}>Logout</Button>
                                    </Nav>
                                    :
                                    <Nav className="me-auto">
                                        <Nav.Link href="/login">Login</Nav.Link>
                                        <Nav.Link href="/signup">Signup</Nav.Link>
                                    </Nav>
                            }
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        }
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/userdatachange" element={<UserDataChange />}></Route>
            <Route path="/adminpage" element={<AdminPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
