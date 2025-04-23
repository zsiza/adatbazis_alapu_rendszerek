import React, {useEffect} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./index.css";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

function Index() {
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
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
                    </SwiperSlide>{" "}
                    <SwiperSlide>
                        <img className="book" src="images/Book.png" alt="" />
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
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>{" "}
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>{" "}
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>{" "}
                <div className="book">
                    <img src="images/Book.png" alt="" />
                </div>{" "}
                <div className="book">
                    <img src="images/Book.png" alt="" />
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
                        <div>
                            <Index />
                        </div>
                    }
                </div>
                :
                <Index />
            }
        </div>
    )
}

export default Home;