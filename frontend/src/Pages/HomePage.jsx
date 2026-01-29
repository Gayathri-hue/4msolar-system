import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Button } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import "../styles/layouts/HomePage.scss";
import Header from "./Header";
import Footer from "./Footer";
import video from "../../src/assets/Video/slider_2.mp4";
import OurServices from "./OurServices";
import AboutUs from "./AboutUs";

const { Title, Paragraph } = Typography;

function HomePage() {
  const [index, setIndex] = useState(0);
  const services = [
    "New Solar Power Plan Installation",
    "Solar Power Plan Service",
    "Operation & Maintanence Service",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Header />
      <div className="hero-wrapper">
        <div className="hero-background">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src={video} type="video/mp4" />
          </video>
        </div>

        <div className="hero-overlay">
          <div className="hero-content">
            <Title level={1} className="title-animate">
              <span className="first-letter">S</span>olar System Chennai
            </Title>

            <Paragraph className="subtitle">
              Reduce Your Electricity Bills with High-Efficiency Solar Systems
            </Paragraph>

            <div className="rotating-text-container">
              {services.map((service, i) => (
                <div
                  key={service}
                  className={`rotating-text ${i === index ? "fade-in" : "hidden"}`}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>

        <a
          href="https://wa.me/9345115509"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
        >
          <WhatsAppOutlined />
        </a>
      </div>

      <div ref={servicesRef}>
        <OurServices />
      </div>
      <div ref={aboutRef}>
        <AboutUs />
      </div>
      <div ref={contactRef}>
        <Footer
          scrollToServices={() => scrollToRef(servicesRef)}
          scrollToAbout={() => scrollToRef(aboutRef)}
          scrollToContact={() => scrollToRef(contactRef)}
        />
      </div>
    </div>
  );
}

export default HomePage;
