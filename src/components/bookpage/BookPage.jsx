import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import "./BookPage.css";

export default function BookPage() {
  const [values, setValues] = useState([]);
  const [darab, setDarab] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:8081/showbookpage")
      .then((res) => {
        if (res.data.status === "success") {
          setValues(res.data.result);
        } else if (res.data.status === "failed") {
          navigate("/");
        } else {
          alert("failed");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container>
      <div className="bookpage-card">
        <Row>
          <Col>{values[1]}</Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <img className="bookpage-img" src={values[9]} alt={values[1]} />
          </Col>
          <Col>
            <Stack gap={1}>
              <div className="p-2">ISBN: {values[0]}</div>
              <div className="p-2">Kiadó: {values[2]}</div>
              <div className="p-2">Kiadás éve: {values[3]}</div>
              <div className="p-2">Nyelv: {values[4]}</div>
              <div className="p-2">Ár: {values[5]} Ft</div>
              <div className="p-2">Elérhető darab: {values[7]}</div>
              <div className="p-2">Szerzők: {values[10]}</div>
              <div className="p-2">Műfajok: {values[11]}</div>
              {values[12] !== "" && (
                <div className="p-2">E-könyv formátum: {values[12]}</div>
              )}
              {values[13] !== 0 && (
                <div className="p-2">Hangoskönyv hossz: {values[13]} perc</div>
              )}

              <div className="bookpage-divider"></div>

              <form>
                <div className="p-2 d-flex align-items-center gap-2">
                  <label htmlFor="darabInput" className="mb-0">
                    Darab:
                  </label>
                  <input
                    id="darabInput"
                    type="number"
                    className="darab-input"
                    value={darab}
                    name="darab"
                    min="1"
                    max={values[7]}
                    onChange={(e) => setDarab(e.target.value)}
                  />
                </div>
                <div className="p-2">
                  <Button type="submit" className="bookpage-btn">
                    Kosárba teszem
                  </Button>
                </div>
              </form>
            </Stack>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>{values[6]}</Col>
        </Row>
      </div>
    </Container>
  );
}
