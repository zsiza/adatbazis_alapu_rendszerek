import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../index/index.css";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import React, { useEffect } from "react";
import axios from "axios";

function Index() {
  let cim = "images/Book.png";

  const [values, setValues] = React.useState({
    img1: "images/atitkokgyemantja.png",
    img2: "images/atitkokgyemantja.png",
    img3: "images/atitkokgyemantja.png",
    img4: "images/atitkokgyemantja.png",
    img5: "images/atitkokgyemantja.png",
    img6: "images/atitkokgyemantja.png",
    img7: "images/atitkokgyemantja.png",
    img8: "images/atitkokgyemantja.png",
    img9: "images/atitkokgyemantja.png",
    img10: "images/atitkokgyemantja.png",
    img11: "images/atitkokgyemantja.png",
    img12: "images/atitkokgyemantja.png",
    img13: "images/atitkokgyemantja.png",
    img14: "images/atitkokgyemantja.png",
    img15: "images/atitkokgyemantja.png",
    img16: "images/atitkokgyemantja.png",
  });

  useEffect(() => {
    axios
      .post("http://localhost:8081/getbookimages", values)
      .then((res) => {
        if (res.data.status === "success") {
          values.img1 = res.data.result[0];
          values.img2 = res.data.result[1];
          values.img3 = res.data.result[2];
          values.img4 = res.data.result[3];
          values.img5 = res.data.result[4];
          values.img6 = res.data.result[5];
          values.img7 = res.data.result[6];
          values.img8 = res.data.result[7];
          values.img9 = res.data.result[8];
          values.img10 = res.data.result[9];
          values.img11 = res.data.result[10];
          values.img12 = res.data.result[11];
          values.img13 = res.data.result[13];
          values.img14 = res.data.result[14];
          values.img15 = res.data.result[15];
          values.img16 = res.data.result[16];
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /*
  if (typeof window !== "undefined") {
    kepekBetoltese();
  }
   */

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
            <img className="book" src={values.img1} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img2} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img3} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img4} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img5} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img6} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img7} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img8} alt="cim" />
          </SwiperSlide>{" "}
          <SwiperSlide>
            <img className="book" src={values.img9} alt="cim" />
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
          <img src={values.img1} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img2} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img3} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img4} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img5} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img6} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img7} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img8} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img9} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img10} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img11} alt="cim" />
        </div>
        <div className="book">
          <img src={values.img12} alt="cim" />
        </div>{" "}
        <div className="book">
          <img src={values.img13} alt="cim" />
        </div>{" "}
        <div className="book">
          <img src={values.img14} alt="cim" />
        </div>{" "}
        <div className="book">
          <img src={values.img15} alt="cim" />
        </div>{" "}
        <div className="book">
          <img src={values.img16} alt="cim" />
        </div>
      </div>
    </>
  );
}

export default Index;
