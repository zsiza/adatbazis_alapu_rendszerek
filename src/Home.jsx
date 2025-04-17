import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

function AdminPage() {
    const [values, setValues] = useState({
        isbn: "",
        cim: "",
        szerzok: "",
        mufajok: "",
        kiado: "",
        kiadasEve: 0,
        nyelv: "",
        ar: 0,
        ismerteto: "",
        elerhetoDb: 0,
        formatum: "",
        hossz: 0
    });
    const [delisbn, setDelisbn] = useState("");
    const [searchisbn, setSearchisbn] = useState("");
    const [modifiedValues, setModifiedValues] = useState({
        isbn: "",
        cim: "",
        szerzok: "",
        mufajok: "",
        kiado: "",
        kiadasEve: 0,
        nyelv: "",
        ar: 0,
        ismerteto: "",
        elerhetoDb: 0,
        formatum: "",
        hossz: 0
    })
    const [modify, setModify] = useState(true);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleInputForModify = (event) => {
        setModifiedValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/addBooks', values)
        .then(res => {
            if (res.data.status === "success") {
                location.reload(true);
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

    const handleSubmitForDelete = async () => {
        axios.post('http://localhost:8081/deleteBooks', {delisbn:delisbn})
        .then(res => {
            if (res.data.status === "success") {
                location.reload(true);
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

    const handleSearch = async () => {
        axios.post('http://localhost:8081/searchBooks', {searchisbn:searchisbn})
        .then(res => {
            if (res.data.status === "success") {
                modifiedValues.isbn = res.data.isbn;
                modifiedValues.cim = res.data.cim;
                modifiedValues.szerzok = res.data.szerzok;
                modifiedValues.mufajok = res.data.mufajok;
                modifiedValues.kiado = res.data.kiado;
                modifiedValues.kiadasEve = res.data.kiadasEve;
                modifiedValues.nyelv = res.data.nyelv;
                modifiedValues.ar = res.data.ar;
                modifiedValues.ismerteto = res.data.ismerteto;
                modifiedValues.elerhetoDb=res.data.elerhetoDb;
                modifiedValues.formatum = res.data.formatum;
                modifiedValues.hossz = res.data.hossz;
                setModify(false);
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

    const handleModify = async () => {
        axios.post('http://localhost:8081/modifyBooks', modifiedValues)
        .then(res => {
            if (res.data.status === "success") {
                alert(res.data.message);
                setModify(true);
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div id="adminform" className="loginsignupform">
            <div className="formcontainer">
                <form onSubmit={handleSubmit}>
                    <h2>Kiadvány felvétele</h2>
                    <div className="inputcontainer">
                        <div>
                            <label htmlFor="isbn"><strong>ISBN</strong></label>
                            <input type="text" name="isbn" placeholder="ISBN" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="cim"><strong>Cím</strong></label>
                            <input type="text" name="cim" placeholder="Cím" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="szerzok"><strong>Szerzők (a, b, c...)</strong></label>
                            <input type="text" name="szerzok" placeholder="Szerzők" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="mufajok"><strong>Műfajok (a, b, c...)</strong></label>
                            <input type="text" name="mufajok" placeholder="Műfajok" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="kiado"><strong>Kiadó</strong></label>
                            <input type="text" name="kiado" placeholder="Kiadó" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="kiadasEve"><strong>Kiadás éve</strong></label>
                            <input type="number" name="kiadasEve" placeholder="Kiadás éve" onChange={handleInput} />
                        </div>
                    </div>
                    <div className="inputcontainer">
                        <div>
                            <label htmlFor="nyelv"><strong>Nyelv</strong></label>
                            <input type="text" name="nyelv" placeholder="Nyelv" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="ar"><strong>Ár</strong></label>
                            <input type="number" name="ar" placeholder="Ár" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="ismerteto"><strong>Rövid ismertető</strong></label>
                            <input type="text" name="ismerteto" placeholder="Rövid ismertető" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="elerhetoDb"><strong>Elérhető darab</strong></label>
                            <input type="number" name="elerhetoDb" placeholder="Elérhető darab" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="formatum"><strong>Formátum (csak e-könyveknél)</strong></label>
                            <input type="text" name="formatum" placeholder="Formátum" onChange={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="hossz"><strong>Hossz (percben, csak hangoskönyveknél)</strong></label>
                            <input type="number" name="hossz" placeholder="Hossz" onChange={handleInput}/>
                        </div>
                    </div>
                    <button type="submit">Felvétel</button>
                </form>
            </div>
            <hr/>
            <div className="formcontainer">
                {modify ?
                    <form action={handleSearch}>
                        <h2>Módosítás egy kiadványon</h2>
                        <div className="shortinput">
                            <label htmlFor="searchisbn"><strong>ISBN</strong></label>
                            <input type="text" name="searchisbn" placeholder="ISBN" onChange={event => setSearchisbn(event.target.value)} />
                        </div>
                        <button type="submit">Keres</button>
                    </form>
                    :
                    <form action={handleModify}>
                        <h2>Módosítás egy kiadványon</h2>
                        <div className="inputcontainer">
                            <div>
                                <label htmlFor="isbn"><strong>ISBN</strong></label>
                                <input type="text" name="isbn" readOnly={true} onChange={handleInputForModify} defaultValue={modifiedValues.isbn} />
                            </div>
                            <div>
                                <label htmlFor="cim"><strong>Cím</strong></label>
                                <input type="text" name="cim" onChange={handleInputForModify} defaultValue={modifiedValues.cim}/>
                            </div>
                            <div>
                                <label htmlFor="szerzok"><strong>Szerzők (a, b, c...)</strong></label>
                                <input type="text" name="szerzok" onChange={handleInputForModify} defaultValue={modifiedValues.szerzok}/>
                            </div>
                            <div>
                                <label htmlFor="mufajok"><strong>Műfajok (a, b, c...)</strong></label>
                                <input type="text" name="mufajok" onChange={handleInputForModify} defaultValue={modifiedValues.mufajok}/>
                            </div>
                            <div>
                                <label htmlFor="kiado"><strong>Kiadó</strong></label>
                                <input type="text" name="kiado" onChange={handleInputForModify} defaultValue={modifiedValues.kiado}/>
                            </div>
                            <div>
                                <label htmlFor="kiadasEve"><strong>Kiadás éve</strong></label>
                                <input type="number" name="kiadasEve" onChange={handleInputForModify} defaultValue={modifiedValues.kiadasEve}/>
                            </div>
                        </div>
                        <div className="inputcontainer">
                            <div>
                                <label htmlFor="nyelv"><strong>Nyelv</strong></label>
                                <input type="text" name="nyelv" onChange={handleInputForModify} defaultValue={modifiedValues.nyelv}/>
                            </div>
                            <div>
                                <label htmlFor="ar"><strong>Ár</strong></label>
                                <input type="number" name="ar" onChange={handleInputForModify} defaultValue={modifiedValues.ar} />
                            </div>
                            <div>
                                <label htmlFor="ismerteto"><strong>Rövid ismertető</strong></label>
                                <input type="text" name="ismerteto" onChange={handleInputForModify} defaultValue={modifiedValues.ismerteto}/>
                            </div>
                            <div>
                                <label htmlFor="elerhetoDb"><strong>Elérhető darab</strong></label>
                                <input type="number" name="elerhetoDb" onChange={handleInputForModify} defaultValue={modifiedValues.elerhetoDb}/>
                            </div>
                            <div>
                                <label htmlFor="formatum"><strong>Formátum (csak e-könyveknél)</strong></label>
                                <input type="text" name="formatum" onChange={handleInputForModify} defaultValue={modifiedValues.formatum}/>
                            </div>
                            <div>
                                <label htmlFor="hossz"><strong>Hossz (percben, csak hangoskönyveknél)</strong></label>
                                <input type="number" name="hossz" onChange={handleInputForModify} defaultValue={modifiedValues.hossz}/>
                            </div>
                        </div>
                        <button type="submit">Módosít</button>
                    </form>
                }
            </div>
            <hr/>
            <div className="formcontainer">
                <form action={handleSubmitForDelete}>
                    <h2>Kiadvány törlése</h2>
                    <div className="shortinput">
                        <label htmlFor="isbn"><strong>ISBN</strong></label>
                        <input type="text" name="isbn" placeholder="ISBN" onChange={e => setDelisbn(e.target.value)} />
                    </div>
                    <button type="submit">Delete</button>
                </form>
            </div>
        </div>
    )
}

function Home() {
    const [admin, setAdmin] = React.useState(false);
    const [auth, setAuth] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [email, setEmail] = React.useState("");

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

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
    }, [navigate])

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
        <div>
            {
                auth ?
                <div>
                    {
                    admin ?
                        <AdminPage />
                    :
                    <h3 className="vasarlotext">You are authorized, {email}</h3>
                    }
                    <button className="logoutbutton" onClick={handleDelete}>Logout</button>
                </div>
                :
                <div id="notAuthenticated">
                    <h3>{message}</h3>
                    <h3>Login now</h3>
                    <Link to="/login" className="link">Login</Link>
                    <Link to="/signup" className="link">Signup</Link>
                </div>
            }
        </div>
    )
}

export default Home;