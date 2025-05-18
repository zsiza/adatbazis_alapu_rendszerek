import React, {useEffect} from "react";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Search() {
    const [books, setBooks] = React.useState([]);
    const [cim, setCim] = React.useState("");
    const [szerzo, setSzerzo] = React.useState("");
    const [mufaj, setMufaj] = React.useState("");
    const [mufajok, setMufajok] = React.useState([]);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:8081")
            .then((res) => {
                if (res) {
                    axios.post("http://localhost:8081/getallbooks")
                    .then((res) => {
                        setBooks(res.data.result);
                        setMufajok(res.data.mufajok.concat([["összes"]]));
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const getBookPage = (isbn) => {
        axios.post("http://localhost:8081/getbookpage", {isbn: isbn})
            .then((res) => {
                if (res.data.status === "success") {
                    navigate("/bookpage");
                } else {
                    alert("failed");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const filteredBooks = books.filter((book) => {
        const lowercim = book[1].toLowerCase();
        const lowerszerzok = book[6].toLowerCase();
        const lowermufajok = book[7].toLowerCase();
        const lowersearchcim = cim.toLowerCase();
        const lowersearchszerzo = szerzo.toLowerCase();
        if (mufaj === "összes") {
            return lowercim.includes(lowersearchcim) && lowerszerzok.includes(lowersearchszerzo) && lowermufajok.includes("");
        } else {
            const lowersearchmufaj = mufaj.toLowerCase();
            return lowercim.includes(lowersearchcim) && lowerszerzok.includes(lowersearchszerzo) && lowermufajok.includes(lowersearchmufaj);
        }
    })

    return (
        <>
            <div style={{width: "75%", margin: "20px auto", display: "flex", flexDirection: "row", alignItems: "normal", flexWrap: "wrap", justifyContent: "left"}}>
                {mufajok.map((m) =>
                    <li key={m[0]} style={{display: "inline-block", marginRight: "5px", marginTop: "10px"}}>
                        <Button onClick={() => setMufaj(m[0])} style={{background: "#efe8e0", border: "#dab688", color: "black"}}>{m[0]}</Button>
                    </li>
                )}
            </div>
            <Container>
                <Row style={{marginTop: '30px'}}>
                    <Col>
                        <form>
                            <label>Könyv címe:</label>
                            <input style={{border: "2px solid black", marginLeft: "10px" }} type="text" defaultValue="" onChange={(e) => setCim(e.target.value)} />
                        </form>
                    </Col>
                    <Col>
                        <form>
                            <label>Szerzők:</label>
                            <input style={{border: "2px solid black", marginLeft: "10px" }} type="text" defaultValue="" onChange={(e) => setSzerzo(e.target.value)} />
                        </form>
                    </Col>
                </Row>
            </Container>
            <Container style={{ display: "flex", alignItems: "center", flexDirection: "row", flexWrap: "wrap" }}>
                {filteredBooks.map(book => (
                    <Row key={book[0]} style={{background: "#f3ede8", padding: "20px", margin: "20px", width: "600px"}}>
                        <Col >
                            <img src={book[5]} alt={book[1]}  style={{ width: "150px" }} onClick={() => getBookPage([book[0]])} />
                        </Col>
                        <Col style={{paddingTop: "40px"}}>
                            {book[1]}<br/>{book[3]} Ft<br/>{book[4]} elérhető darab<br/>{book[6]}<br/>{book[7]}<br/><button onClick={() => getBookPage([book[0]])}>Megnézem</button>
                        </Col>
                    </Row>
                ))}
            </Container>
        </>
    )
}