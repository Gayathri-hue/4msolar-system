import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const primaryGreen = "#3a8017";
const accentColor = "#e67e22"; // like the orange underline in screenshot
const textDark = "#1a1a1a";
const textLight = "#ffffff";
const cardBg = "#ffffff";
const hoverBg = primaryGreen;

function AboutUs() {
  const cards = [
    {
      title: "Our Mission",
      description:
        "Promote sustainable energy solutions and significantly reduce electricity costs for every customer.",
      icon: "🌱", // replace with real icon component if you have one
    },
    {
      title: "Our Vision",
      description:
        "To become the most trusted and preferred solar solutions provider across Chennai and Tamil Nadu.",
      icon: "🔭",
    },
    {
      title: "Our Values",
      description:
        "Uncompromising quality, utmost reliability, and 100% customer satisfaction in every project.",
      icon: "⭐",
    },
  ];

  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out" });
  }, []);

  return (
    <section
      data-aos="fade-up"
      data-aos-duration="1000"
      style={{
        padding: "80px 20px",
        textAlign: "center",
        background: "#f8fafc",
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
        About 4M Solar System
      </h2>

      <p
        data-aos="fade-up"
        data-aos-delay="200"
        style={{
          maxWidth: "820px",
          margin: "0 auto 3.5rem",
          fontSize: "1.1rem",
          color: "#444",
          lineHeight: 1.7,
        }}
      >
        We are a Chennai-based team specializing in high-efficiency solar panel
        installations, maintenance, and smart energy consultation for homes,
        businesses, and industries. Our goal is simple — make solar affordable,
        reliable, and impactful.
      </p>

      {/* Main container – centered, responsive */}
      <div
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 10px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "clamp(16px, 4vw, 40px)",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "fit-content", // allows scroll on very small screens
          }}
        >
          {cards.map((card, index) => {
            const isHovered = hoverIndex === index;

            return (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 200}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  position: "relative",
                  width: "clamp(260px, 28vw, 340px)",
                  minWidth: "260px",
                  transform: isHovered
                    ? "scale(1.08) translateY(-12px)"
                    : "scale(1)",
                  transition: "all 0.4s ease",
                  zIndex: isHovered ? 10 : 1,
                  filter: isHovered ? "brightness(1.05)" : "none",
                }}
              >
                {/* Arrow / Chevron shaped card */}
                <div
                  style={{
                    position: "relative",
                    background: isHovered ? hoverBg : cardBg,
                    color: isHovered ? textLight : textDark,
                    padding: "2.2rem 1.8rem 2rem",
                    borderRadius: "16px",
                    boxShadow: isHovered
                      ? "0 20px 40px rgba(58,128,23,0.25)"
                      : "0 8px 24px rgba(0,0,0,0.1)",
                    transition: "all 0.4s ease",
                    clipPath: "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)", // angled sides
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      fontSize: "2.8rem",
                      marginBottom: "1rem",
                      opacity: 0.9,
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h4
                    style={{
                      fontSize: "1.45rem",
                      fontWeight: 700,
                      margin: "0 0 0.9rem",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {card.title}
                  </h4>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      margin: 0,
                      opacity: isHovered ? 0.95 : 0.82,
                    }}
                  >
                    {card.description}
                  </p>

                  {/* Accent underline bar */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "10%",
                      right: "10%",
                      height: "5px",
                      background: accentColor,
                      borderRadius: "4px 4px 0 0",
                      transform: isHovered ? "scaleX(1.1)" : "scaleX(0.7)",
                      transition: "transform 0.4s ease",
                      opacity: isHovered ? 1 : 0.7,
                    }}
                  />
                </div>

                {/* Optional: subtle connecting line (only between cards) */}
                {index < cards.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "100%",
                      width: "clamp(20px, 5vw, 60px)",
                      height: "3px",
                      background: "rgba(58,128,23,0.3)",
                      transform: "translateY(-50%)",
                      zIndex: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .about-cards-scroller::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      <p
        style={{
          fontSize: "0.95rem",
          color: "#666",
          marginTop: "2.5rem",
        }}
      >
        ← Scroll / swipe if needed →
      </p>
    </section>
  );
}

export default AboutUs;
