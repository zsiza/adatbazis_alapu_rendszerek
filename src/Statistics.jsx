import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

export default function Statistics() {
    const [email, setEmail] = useState("");
    const [auth, setAuth] = React.useState(false);
    const [legaktivabb, setLegaktivabb] = React.useState([]);
    const [legeladottabb, setLegeladottabb] = React.useState([]);
    const [mufaj, setMufaj] = React.useState([]);
    const [szerzo, setSszerzo] = React.useState([]);
    const [nullaSzerzok, setNullaSzerzok] = React.useState([]);
    const [nullaMufajok, setNullaMufajok] = React.useState([]);
    const [koltesek, setKoltesek] = React.useState([]);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:8081")
            .then((res) => {
                console.log(res);
                if (res.data.Status === "Success" && res.data.admin === true) {
                    setAuth(true);
                    setEmail(res.data.email);
                    setLegaktivabb(res.data.legaktivabb);
                    setLegeladottabb(res.data.legeladottabb);
                    setMufaj(res.data.mufaj);
                    setSszerzo(res.data.szerzo);
                    setNullaSzerzok(res.data.nulla_eladas_szerzok);
                    setNullaMufajok(res.data.nulla_eladas_mufajok);
                    setKoltesek(res.data.koltesek);
                } else if (res.data.Status === "Success" && res.data.admin !== false) {
                    setAuth(true);
                    setEmail(res.data.email);
                    navigate("/");
                } else {
                    setAuth(false);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [navigate])

    return (
        <>
            {
                auth ? <>
                        <h1>Legtöbb vásárlással rendelkező felhasználó: </h1>
                        <h2>{legaktivabb[2]} {legaktivabb[1]}</h2>
                        <h2>{legaktivabb[0]}</h2>
                        <h2>{legaktivabb[3]} rendelés</h2>
                        <hr/>
                        <h1>Vásárlók költései összesen</h1>
                        {koltesek.map(vasarlo =>
                            <li key={vasarlo[0]}>
                                {vasarlo[0]}: {vasarlo[1]} Ft
                            </li>
                        )}
                        <hr/>
                        <h1>Legtöbb példányban eladott könyv</h1>
                        <h2>{legeladottabb[1]}</h2>
                        <h2>{legeladottabb[0]}</h2>
                        <h2>{legeladottabb[2]} db eladás</h2>
                        <hr/>
                        <h1>Legnépszerűbb műfaj</h1>
                        <h2>{mufaj[0]}</h2>
                        <h2>{mufaj[1]} db eladás</h2>
                        <hr/>
                        <h1>Legnépszerűbb szerző</h1>
                        <h2>{szerzo[0]}</h2>
                        <h2>{szerzo[1]} db eladás</h2>
                        <hr/>
                        <h1>0db eladással rendelkező szerzők</h1>
                        {nullaSzerzok.map(szerzo =>
                            <li key={szerzo}>
                                <h2>{szerzo}</h2>
                            </li>
                        )}
                        <hr/>
                        <h1>0db eladással rendelkező műfajok</h1>
                        {nullaMufajok.map(mufaj =>
                            <li key={mufaj}>
                                <h2>{mufaj}</h2>
                            </li>
                        )}
                    </>
                    :
                    <div>
                        <div id="notAuthenticated">
                            <h3>not authenticated</h3>
                            <h3>Login now</h3>
                            <Link to="/login" className="link">Login</Link>
                            <Link to="/signup" className="link">Signup</Link>
                        </div>
                    </div>
            }
        </>
    )
}