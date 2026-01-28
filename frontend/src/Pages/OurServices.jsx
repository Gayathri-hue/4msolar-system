import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { Row, Col, Card } from "antd";

const primaryGreen = "#3a8017";
const hoverGreen = "rgba(58, 128, 23, 0.92)";
const textDark = "#1f2937";
const textLight = "#ffffff";

const servicesData = [
  {
    title: "New Solar Power Plant Installation",
    description:
      "End-to-end expert installation of high-efficiency solar systems tailored for residential, commercial, and industrial needs.",
    icon: "☀️",
  },
  {
    title: "Solar Power Plant Service & Optimization",
    description:
      "Performance tuning, system audits, and upgrades to maximize output and extend the life of your solar investment.",
    icon: "🔧",
  },
  {
    title: "Operation & Maintenance Services",
    description:
      "Regular monitoring, cleaning, preventive maintenance, and 24×7 support to ensure consistent energy generation.",
    icon: "🛠️",
  },
];

function OurServices() {
  const [hovered, setHovered] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // animate only once
      easing: "ease-out",
      offset: 80, // start animation a bit earlier
    });
  }, []);

  return (
    <section
      data-aos="fade-up"
      data-aos-duration="1000"
      style={{
        padding: "80px 24px",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
      }}
    >
      <h2
        data-aos="fade-up"
        data-aos-delay="100"
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: primaryGreen,
          marginBottom: "1rem",
        }}
      >
        Our Solar Services
      </h2>

      <p
        data-aos="fade-up"
        data-aos-delay="200"
        style={{
          maxWidth: "760px",
          margin: "0 auto 3rem",
          fontSize: "1.1rem",
          color: "#4b5563",
          lineHeight: 1.7,
        }}
      >
        We deliver reliable, high-quality solar solutions — from initial
        installation to long-term care — helping Chennai homes and businesses
        save money while embracing clean energy.
      </p>

      <Row gutter={[24, 32]} justify="center">
        {servicesData.map((service, index) => {
          const isHovered = hovered === index;

          return (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                data-aos="fade-up"
                data-aos-delay={index * 150} // stagger: 0ms, 150ms, 300ms
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "32px 24px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: "#ffffff",
                  color: textDark,
                }}
              >
                {/* Hover overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: hoverGreen,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 1,
                  }}
                />

                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      fontSize: "2.8rem",
                      color: isHovered ? textLight : primaryGreen,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {service.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: "1rem",
                      color: isHovered ? textLight : textDark,
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      margin: 0,
                      color: isHovered ? textLight : textDark,
                    }}
                  >
                    {service.description}
                  </p>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}

export default OurServices;
