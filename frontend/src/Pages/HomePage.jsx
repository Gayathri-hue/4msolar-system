// import React, { useEffect, useState } from "react";
// import { Typography } from "antd";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import "../styles/layouts/HomePage.scss";
// import Header from "./Header";
// import Footer from "./Footer";
// import { Row, Col } from "antd";
// import { WhatsAppOutlined } from "@ant-design/icons";

// const { Title, Paragraph } = Typography;

// function HomePage() {
//   const [selectedService, setSelectedService] = useState(""); // Tracks service selection

//   useEffect(() => {
//     AOS.init({ duration: 1200, once: true });
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSelectedService((prev) => (prev === "Repair" ? "Install" : "Repair"));
//     }, 4000); // every 4 sec switch

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <Header />

//       <div className="hero-wrapper">
//         <div className="hero-background"></div>

//         <div className="hero-overlay">
//           <div className="hero-content" data-aos="fade-up">
//             <Row align="middle">
//               <Col xs={24} md={16}>
//                 <div className="left-text">
//                   <h1 className="main-title">
//                     <span className="first-letter">S</span>olar System Chennai
//                   </h1>

//                   <Paragraph className="subtitle">
//                     Reduce Your Electricity Bills with High-Efficiency Solar
//                     Systems
//                   </Paragraph>

//                   <div className="service-content">
//                     {selectedService === "Repair" && (
//                       <div className="service-box">
//                         <h3>Solar Repair Service</h3>
//                         <p>
//                           Expert maintenance, inverter fixing, panel cleaning.
//                         </p>
//                       </div>
//                     )}

//                     {selectedService === "Install" && (
//                       <div className="service-box">
//                         <h3>Solar Installation Service</h3>
//                         <p>On-grid, Off-grid, Hybrid solar system setup.</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Col>

//               <Col xs={0} md={8}></Col>
//             </Row>
//           </div>

//           <a
//             href="https://wa.me/919999999999"
//             className="whatsapp-float"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <WhatsAppOutlined />
//           </a>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import "../styles/layouts/HomePage.scss";
import Header from "./Header";
import Footer from "./Footer";

const { Title, Paragraph } = Typography;

function HomePage() {
  const [index, setIndex] = useState(0);
  const services = [
    "Solar Repair Service",
    "Solar Installation",
    "Solar Purchase",
  ];

  // Handle the rotating text logic
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ overflow: "hidden" }}>
      <Header />
      <div className="hero-wrapper">
        {/* Animated Background Image */}
        <div className="hero-background"></div>

        {/* Gradient Overlay */}
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

        {/* Floating WhatsApp Icon */}
        <a
          href="https://wa.me/9345115509"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
        >
          <WhatsAppOutlined />
        </a>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
