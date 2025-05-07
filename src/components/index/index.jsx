import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../index/index.css";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

function Index({ categoryFilter, searchQuery, setSearchQuery }) {
  const [bookImages, setBookImages] = useState(
    Array(16).fill("images/atitkokgyemantja.png")
  );

  useEffect(() => {
    axios
      .post("http://localhost:8081/getbookimages", {})
      .then((res) => {
        if (res.data.status === "success" && res.data.result) {
          const updatedImages = [...bookImages];
          res.data.result.slice(0, 16).forEach((img, index) => {
            updatedImages[index] = img;
          });
          setBookImages(updatedImages);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredBooks = bookImages.filter((src) => {
    const lowerSrc = src.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();

    if (categoryFilter === "E-books") {
      return lowerSrc.includes("ebook") && lowerSrc.includes(lowerQuery);
    }

    if (categoryFilter === "Audiobooks") {
      return lowerSrc.includes("audiobook") && lowerSrc.includes(lowerQuery);
    }

    return lowerSrc.includes(lowerQuery); // fallback: all types
  });

  const renderBook = (src, index) => (
    <div className="book" key={index}>
      <img className="book-base" src="images/Book.png" alt="book base" />
      <img className="book-cover" src={src} alt="cover" />
    </div>
  );

  return (
    <>
      <Container className="mt-3">
        <Row className="justify-content-center">
          <Col md={10}>
            <Form className="d-flex">
              <Form.Control
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a book"
                className="search-input me-2"
              />
              <Button type="submit" className="search-btn">
                Search
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <div className="swiper-container">
        <Swiper
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={7}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {filteredBooks.slice(0, 9).map((src, index) => (
            <SwiperSlide key={index}>{renderBook(src, index)}</SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="card-container">
        <img src="images/alice.png" alt="featured" />
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
        {filteredBooks.map((src, index) => renderBook(src, index))}
      </div>
    </>
  );
}

export default Index;
