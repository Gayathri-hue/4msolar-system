import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Ourservices.scss";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
      offset: 100,
    });
  }, []);

  const handleExplore = () => {
    const token = localStorage.getItem("token"); // or employeeToken / authToken

    if (token) {
      navigate("/user/dashboard"); // already logged in
    } else {
      navigate("/login"); // not logged in
    }
  };

  return (
    <section className="solar-services-hero">
      <h2 className="hero-main-title" data-aos="fade-up">
        Our Solar Services
      </h2>

      <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="150">
        We deliver reliable, high-quality solar solutions — from initial
        installation to long-term care — helping Chennai homes and businesses
        save money while embracing clean energy.
      </p>

      <div className="services-grid">
        {servicesData.map((service, index) => (
          <div
            key={index}
            className="service-item"
            data-aos="zoom-in"
            data-aos-delay={index * 200}
          >
            <div className="blob-card-outer">
              <div className={`blob-bg blob-bg-${index + 1}`} />
              <div className="blob-card-content">
                <div className="service-emoji">{service.icon}</div>
                <h3 className="service-heading">{service.title}</h3>
                <p className="service-info">{service.description}</p>
                <button className="explore-btn" onClick={handleExplore}>
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurServices;
