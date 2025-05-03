import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./header.css";
import React, {useEffect} from "react";
import axios from "axios";

function authFalse() {
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
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/Signup">Signup</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Form inline>
                  <Row>
                    <Col xs="auto">
                      <Form.Control
                          type="text"
                          placeholder="Find a book"
                          className=" mr-sm-2"
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
            <Nav.Link className="navlink" eventKey="/e-books">
              E-books
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="navlink" eventKey="/audiobooks">
              Audiobooks
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
  )
}

function authTrue() {
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

  return (
      <>
        <Navbar
            collapseOnSelect
            expand="lg"
            sticky="top"
            className="custom-navbar"
        >
          <Container>
            <Navbar.Brand href="/index">Bookstore</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/login">Login</Nav.Link>
                <Button className="search-btn" type="submit" onClick={handleDelete}>Logout</Button>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Form inline>
                  <Row>
                    <Col xs="auto">
                      <Form.Control
                          type="text"
                          placeholder="Find a book"
                          className=" mr-sm-2"
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
            <Nav.Link className="navlink" eventKey="/e-books">
              E-books
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="navlink" eventKey="/audiobooks">
              Audiobooks
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </>
  )
}

function Header() {
  const [admin, setAdmin] = React.useState(false);
  const [auth, setAuth] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");

  useEffect(() => {
    axios.get("http://localhost:8081")
        .then((res) => {
          console.log(res);
          if (res.data.Status === "Success") {
            setAuth(true);
            setEmail(res.data.email);
            setAdmin(res.data.admin);
          } else {
            setAuth(false);
            setMessage(res.data.Error);
          }
        })
        .catch((err) => {
          console.log(err);
        })
  }, [])

  return (
      <>
        {
          auth ?
              authTrue() : authFalse()
        }
      </>
  );
}

export default Header;
