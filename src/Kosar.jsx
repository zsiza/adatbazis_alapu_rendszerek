import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import * as os from "node:os";

export default function Kosar() {
    const [values, setValues] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [delDarab, setDelDarab] = useState(1);
    const [delIsbn, setDelIsbn] = useState("");
    let osszertek = 0;

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.post("http://localhost:8081/getkosar")
            .then((res) => {
                console.log(res);
                if (res.data.status === "success") {
                    setValues(res.data.result);
                } else if (res.data.Status === "failed") {
                    navigate("/");
                } else if (res.data.status === "noauth") {
                    navigate("/");
                } if (res.data.status === "empty") {
                    setEmpty(true);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const handleDelete = () => {
        axios.post("http://localhost:8081/deletedarab", {delDarab: delDarab, delIsbn: delIsbn})
        .then((res) => {
            if (res.data.status === "success") {
                alert("successfully deleted");
                location.reload(true);
            } else {
                alert("failed to delete");
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const handleOrder = () => {
        axios.post("http://localhost:8081/order")
        .then((res) => {
            if (res.data.status === "success") {
                alert("successfully ordered");
                navigate("/rendeles");
            } else {
                alert("failed to order");
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <>
            <h1>Kosár tartalma</h1>
            <h2>
                {
                    values.map((item) => {
                        osszertek += item[3]*item[4];
                    })
                }
                {osszertek} Ft
            </h2>
            {empty ? <p>Üres a kosarad</p> : <>
                {
                    values.map((value) => (
                        <li className="kosaritem" key={value[0]}>
                            <p><img className="kosarimg" src={value[2]} alt={value[1]}/>Cím: {value[1]},ár: {value[4]}, darab: {value[3]}, Összesen: {value[3]*value[4]} Ft</p>
                            <div className="kosarinfo">
                                <form action={handleDelete}>
                                    <label>Törlés ennyi darabot:</label>
                                    <input type="number" name="delDarab" defaultValue="0" min="1" max={value[3]} onChange={(e) => {
                                        if (e.target.value === "0") {
                                            alert("0 könyvet nem tudsz törölni");
                                        } else {
                                            setDelDarab(parseInt(e.target.value));
                                            setDelIsbn(value[0]);
                                        }
                                    }} />
                                    <button className="bookbutton" type="submit">Törlés</button>
                                </form>
                            </div>
                        </li>
                    ))
                }
                <p style={{
                    width: "fit-content",
                    margin: "20px auto 30px auto",
                }}>A szállítási cím megegyezik a felhasználói adatoknál megadott címmel, ha a szállítási címen változtatni szeretne, akkor azokon az adatokon változtasson!</p>
                <button className="bookbutton" onClick={handleOrder} style={{
                    display: "block",
                    margin: "auto",
                    padding: "20px",
                }}>Megrendelés</button>
            </>}
        </>
    )
}