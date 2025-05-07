import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./header.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Header({ setCategoryFilter, setSearchQuery, searchQuery }) {
  const [admin, setAdmin] = useState(false);
  const [auth, setAuth] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // Track active category
  const location = useLocation(); // Get the current location (URL)

  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setAdmin(res.data.admin);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          location.reload(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setCategoryFilter(category);
    setSearchQuery("");
  };

  return (
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
            <Nav className="me-auto">
              {auth ? (
                <>
                  {admin ? (
                    <Nav.Link
                      href="/adminpage"
                      active={location.pathname === "/adminpage"}
                    >
                      Book adding
                    </Nav.Link>
                  ) : (
                    <Nav.Link
                      href="/userdatachange"
                      active={location.pathname === "/userdatachange"}
                    >
                      Profile settings
                    </Nav.Link>
                  )}
                  <Button className="search-btn" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link
                    href="/login"
                    active={location.pathname === "/login"}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    href="/signup"
                    active={location.pathname === "/signup"}
                  >
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <Form inline="true">
                <Row>
                  <Col xs="auto">
                    <Button
                      className="cart-btn"
                      href="/cart"
                      active={location.pathname === "/cart"}
                    >
                      <i className="bi bi-cart"></i>
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Nav fill className="bottom-nav" variant="tabs">
        <Nav.Item>
          <Nav.Link
            className="navlink"
            href="#"
            active={activeCategory === "Books"}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleCategorySelect("Books"); // Set filter to Books
            }}
          >
            Books
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className="navlink"
            href="#"
            active={activeCategory === "E-books"}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleCategorySelect("E-books"); // Set filter to E-books
            }}
          >
            E-books
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className="navlink"
            href="#"
            active={activeCategory === "Audiobooks"}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleCategorySelect("Audiobooks"); // Set filter to Audiobooks
            }}
          >
            Audiobooks
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default Header;
