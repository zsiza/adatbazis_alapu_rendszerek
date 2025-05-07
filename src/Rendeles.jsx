import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Rendeles() {
    const [orderValues, setOrderValues] = useState([]);
    const [rendelesid, setRendelesid] = useState(0);
    let osszertek = 0;

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.post("http://localhost:8081/getrendeles")
            .then((res) => {
                console.log(res);
                if (res.data.status === "success") {
                    setOrderValues(res.data.orderItems);
                    setRendelesid(res.data.rendelesid);
                } else if (res.data.Status === "failed") {
                    navigate("/");
                } else if (res.data.status === "noauth") {
                    navigate("/");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [navigate])

    return (
        <>
            <p>
                Rendelés adatai (számla)<br/>Rendelés azonosítója: {rendelesid}
            </p>
            {
                orderValues.map((item) =>
                    <li key={item[3]}>
                        <p>Cím: {item[0]}, Ár: {item[1]} Ft, Rendelt mennyiség: {item[2]}, ISBN: {item[3]}, Összesen: {item[1]*item[2]} Ft</p>
                    </li>
                )
            }
            <p>
                {
                    orderValues.map((item) => {
                        osszertek += item[1]*item[2];
                    })
                }
                Összesen {osszertek} Ft-ot fizettél
            </p>
        </>
    )
}