import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import './Signup.css';

function Signup() {
    const [values, setValues] = React.useState({
        email: "",
        vezeteknev: "",
        keresztnev: "",
        iranyitoszam: 0,
        utca: "",
        hazszam: 0,
        telefonszam: 0,
        jelszo: "",
        jelszoUjra: ""
    });

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        //elősször elküldjük az adatokat, utána megkapjuk a választ és elmegyünk a login oldalra
        axios.post('http://localhost:8081/signup', values)
        .then(res =>
        {
            if (res.data.status === "success") {
                navigate("/login");
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <div>
                <form className="loginsignupform signupform" onSubmit={handleSubmit}>
                    <h2>Sign-up</h2>
                    <div className="inputcontainer">
                        <div>
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input type="email" name="email" placeholder="Email" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="vezeteknev"><strong>Vezetéknév</strong></label>
                            <input type="text" name="vezeteknev" placeholder="Vezetéknév" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="keresztnev"><strong>Keresztnév</strong></label>
                            <input type="text" name="keresztnev" placeholder="Keresztnév" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="iranyitoszam"><strong>Irányítószám</strong></label>
                            <input type="number" name="iranyitoszam" placeholder="Irányítószám" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="utca"><strong>Utca</strong></label>
                            <input type="text" name="utca" placeholder="Utca" onChange={handleInput}/>
                        </div>
                    </div>
                    <div className="inputcontainer">
                        <div>
                            <label htmlFor="hazszam"><strong>Házszám</strong></label>
                            <input type="number" name="hazszam" placeholder="Házszám" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="telefonszam"><strong>Telefonszám</strong></label>
                            <input type="number" name="telefonszam" placeholder="Telefonszám" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="jelszo"><strong>Jelszó</strong></label>
                            <input type="password" name="jelszo" placeholder="Jelszó" onChange={handleInput}/>
                        </div>
                        <div>
                            <label htmlFor="jelszoUjra"><strong>Jelszó újra</strong></label>
                            <input type="password" name="jelszoUjra" placeholder="Jelszó újra" onChange={handleInput}/>
                        </div>
                    </div>
                    <p>By signing up, you automatically agree to our terms and policies.</p>
                    <button type="submit">Sign up</button>
                    <Link className="link" to="/login">Login</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup;