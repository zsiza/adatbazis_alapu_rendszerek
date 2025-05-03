import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./header.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const [admin, setAdmin] = useState(false);
  const [auth, setAuth] = useState(false);

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
                    <Nav.Link href="/adminpage">Book adding</Nav.Link>
                  ) : (
                    <Nav.Link href="/userdatachange">Profile settings</Nav.Link>
                  )}
                  <Button className="search-btn" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <Form inline="true">
                <Row>
                  <Col xs="auto">
                    <Form.Control
                      type="text"
                      placeholder="Find a book"
                      className="mr-sm-2"
                    />
                  </Col>
                  <Col xs="auto">
                    <Button className="search-btn" type="submit">
                      Search
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button className="cart-btn" variant="outline-primary">
                      <i className="bi bi-cart"></i>
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Nav fill className="bottom-nav" variant="tabs" defaultActiveKey="/index">
        <Nav.Item>
          <Nav.Link className="navlink" href="/index">
            Books
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="navlink" href="/e-books">
            E-books
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="navlink" href="/audiobooks">
            Audiobooks
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default Header;
