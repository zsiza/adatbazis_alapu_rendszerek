import React, {useEffect} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./index.css";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

function Index() {
    const [values, setValues] = React.useState(Array(16).fill([]));

    useEffect(() => {
        axios.post("http://localhost:8081/getbookimages", values)
            .then((res) => {
                if (res.data.status === "success") {
                    const filledValues = Array(16).fill([]).map((_, ind) => res.data.result[ind] || []);
                    setValues(filledValues);
                } else {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    },[])

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

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

    return (
        <>
            <div className="swiper-container">
                <Swiper
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    slidesPerView={7}
                    spaceBetween={30}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <img className="book" src={values[0]} alt={values[0]} onClick={() => getBookPage(values[0])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[1]} alt={values[1]} onClick={() => getBookPage(values[1])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[2]} alt={values[2]} onClick={() => getBookPage(values[2])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[3]} alt={values[3]} onClick={() => getBookPage(values[3])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[4]} alt={values[4]} onClick={() => getBookPage(values[4])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[5]} alt={values[5]} onClick={() => getBookPage(values[5])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[6]} alt={values[6]} onClick={() => getBookPage(values[6])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[7]} alt={values[7]} onClick={() => getBookPage(values[7])} />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src={values[8]} alt={values[8]} onClick={() => getBookPage(values[8])} />
                    </SwiperSlide>
                </Swiper>
            </div>

            <div className="card-container">
                <img src="images/alice.png" />
                <div className="text-box">
                    <h1>2023 year 50 most popular bestseller</h1>
                    <p>
                        Explore the literary highlights of 2023 with our '50 Most Popular
                        Bestsellers' badge—a curated collection of the year's must-reads.
                    </p>
                </div>
            </div>

            <h1 className="latest">Latest</h1>
            <div className="book-container">
                <div className="book">
                    <img src={values[0]} alt={values[0]} onClick={() => getBookPage(values[0])} />
                </div>
                <div className="book">
                    <img src={values[1]} alt={values[1]} onClick={() => getBookPage(values[1])} />
                </div>
                <div className="book">
                    <img src={values[2]} alt={values[2]} onClick={() => getBookPage(values[2])} />
                </div>
                <div className="book">
                    <img src={values[3]} alt={values[3]} onClick={() => getBookPage(values[3])} />
                </div>
                <div className="book">
                    <img src={values[4]} alt={values[4]} onClick={() => getBookPage(values[4])}/>
                </div>
                <div className="book">
                    <img src={values[5]} alt={values[5]} onClick={() => getBookPage(values[5])} />
                </div>
                <div className="book">
                    <img src={values[6]} alt={values[6]} onClick={() => getBookPage(values[6])} />
                </div>
                <div className="book">
                    <img src={values[7]} alt={values[7]} onClick={() => getBookPage(values[7])} />
                </div>
                <div className="book">
                    <img src={values[8]} alt={values[8]} onClick={() => getBookPage(values[8])} />
                </div>
                <div className="book">
                    <img src={values[9]} alt={values[9]} onClick={() => getBookPage(values[9])} />
                </div>
                <div className="book">
                    <img src={values[10]} alt={values[10]} onClick={() => getBookPage(values[10])} />
                </div>
                <div className="book">
                    <img src={values[11]} alt={values[11]} onClick={() => getBookPage(values[11])} />
                </div>{" "}
                <div className="book">
                    <img src={values[12]} alt={values[12]} onClick={() => getBookPage(values[12])} />
                </div>{" "}
                <div className="book">
                    <img src={values[13]} alt={values[13]} onClick={() => getBookPage(values[13])} />
                </div>{" "}
                <div className="book">
                    <img src={values[14]} alt={values[14]} onClick={() => getBookPage(values[14])} />
                </div>{" "}
                <div className="book">
                    <img src={values[15]} alt={values[15]} onClick={() => getBookPage(values[15])} />
                </div>
            </div>
        </>
    );
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

    return (
        <div>
            {
                auth ?
                <div>
                    {
                    admin ?
                        <>
                            <Index />
                        </>
                    :
                        <>
                            <Index />
                        </>
                    }
                </div>
                :
                <Index />
            }
        </div>
    )
}

export default Home;