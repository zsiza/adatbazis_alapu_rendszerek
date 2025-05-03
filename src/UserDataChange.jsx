import React, {useEffect, useState} from "react";
import Header from "./components/header/header.jsx";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

export default function UserDataChange() {
    const [email, setEmail] = useState("");
    const [auth, setAuth] = React.useState(false);
    const [showdata, setShowdata] = useState(false);
    const [modifiedValues, setModifiedValues] = useState({
        email: "",
        vezeteknev: "",
        keresztnev: "",
        iranyitoszam: 0,
        utca: "",
        hazszam: 0,
        telefonszam: 0
    })

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get("http://localhost:8081")
            .then((res) => {
                console.log(res);
                if (res.data.Status === "Success" && res.data.admin !== true) {
                    setAuth(true);
                    setEmail(res.data.email);
                } else if (res.data.Status === "Success" && res.data.admin === false) {
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

    const handleInput = (event) => {
        setModifiedValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/modifyuserdata', modifiedValues)
            .then(res =>
            {
                if (res.data.status === "success") {
                    alert(res.data.message);
                    setShowdata(false);
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => console.log(err));
    }

    const handleDataSearch = () => {
        axios.post("http://localhost:8081/getuserdata", {email: email})
            .then(res => {
                if (res.data.status === "success") {
                    modifiedValues.email = res.data.email;
                    modifiedValues.vezeteknev = res.data.vezeteknev;
                    modifiedValues.keresztnev = res.data.keresztnev;
                    modifiedValues.iranyitoszam = res.data.iranyitoszam;
                    modifiedValues.utca = res.data.utca;
                    modifiedValues.hazszam = res.data.hazszam;
                    modifiedValues.telefonszam = res.data.telefonszam;
                    console.log("siker");
                    setShowdata(true);
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            {
                auth ?
                    <div>
                        {
                            showdata ?
                                <form className="loginsignupform signupform" onSubmit={handleSubmit}>
                                    <h3>Adatok módosítása</h3>
                                    <div className="inputcontainer">
                                        <div>
                                            <label htmlFor="email"><strong>Email</strong></label>
                                            <input type="email" name="email" defaultValue={modifiedValues.email} readOnly={true} onChange={handleInput}/>
                                        </div>
                                        <div>
                                            <label htmlFor="vezeteknev"><strong>Vezetéknév</strong></label>
                                            <input type="text" name="vezeteknev" defaultValue={modifiedValues.vezeteknev} onChange={handleInput}/>
                                        </div>
                                        <div>
                                            <label htmlFor="keresztnev"><strong>Keresztnév</strong></label>
                                            <input type="text" name="keresztnev" defaultValue={modifiedValues.keresztnev} onChange={handleInput}/>
                                        </div>
                                        <div>
                                            <label htmlFor="iranyitoszam"><strong>Irányítószám</strong></label>
                                            <input type="number" name="iranyitoszam" defaultValue={modifiedValues.iranyitoszam} onChange={handleInput}/>
                                        </div>
                                        <div>
                                            <label htmlFor="utca"><strong>Utca</strong></label>
                                            <input type="text" name="utca" defaultValue={modifiedValues.utca} onChange={handleInput}/>
                                        </div>
                                    </div>
                                    <div className="inputcontainer">
                                        <div>
                                            <label htmlFor="hazszam"><strong>Házszám</strong></label>
                                            <input type="number" name="hazszam" defaultValue={modifiedValues.hazszam} onChange={handleInput}/>
                                        </div>
                                        <div>
                                            <label htmlFor="telefonszam"><strong>Telefonszám</strong></label>
                                            <input type="number" name="telefonszam" defaultValue={modifiedValues.telefonszam} onChange={handleInput}/>
                                        </div>
                                    </div>
                                    <button type="submit">Módosítás</button>
                                </form>
                                :
                                <form action={handleDataSearch}>
                                    <button type="submit" className="logoutbutton">Adatok lekérése</button>
                                </form>
                        }
                    </div>
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
        </div>
    )
}