import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Don't forget to import the CSS!

const primaryGreen = "#3a8017";
const hoverGreen = "rgba(58, 128, 23, 0.92)";
const textDark = "#1a1a1a";
const textLight = "#ffffff";

function AboutUs() {
  const cards = [
    {
      title: "Our Mission",
      description:
        "Promote sustainable energy solutions and significantly reduce electricity costs for every customer.",
    },
    {
      title: "Our Vision",
      description:
        "To become the most trusted and preferred solar solutions provider across Chennai and Tamil Nadu.",
    },
    {
      title: "Our Values",
      description:
        "Uncompromising quality, utmost reliability, and 100% customer satisfaction in every project.",
    },
  ];

  const [hoverIndex, setHoverIndex] = useState(null);

  // Initialize AOS when component mounts
  useEffect(() => {
    AOS.init({
      duration: 800, // animation speed (ms)
      once: true, // animate only once (recommended for better performance)
      easing: "ease-out", // smooth feel
      // You can add more options like offset: 120, mirror: false, etc.
    });

    // Optional: refresh AOS when needed (useful in SPA with dynamic content)
    // AOS.refresh();
  }, []);

  return (
    <section
      data-aos="fade-up" // ← full section animate down to up
      data-aos-duration="1000" // slightly slower for section feel
      data-aos-once="true"
      style={{
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      <h2
        data-aos="fade-up" // optional: heading can have its own delay
        data-aos-delay="100"
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: primaryGreen,
          marginBottom: "1.2rem",
          letterSpacing: "-0.5px",
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "28px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {cards.map((card, index) => {
          const isHovered = hoverIndex === index;

          return (
            <div
              key={index}
              data-aos="fade-up" // each card also fades up
              data-aos-delay={index * 150} // stagger effect: 0ms, 150ms, 300ms
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                position: "relative",
                overflow: "hidden",
                width: "320px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: isHovered
                  ? "0 12px 32px rgba(58,128,23,0.18)"
                  : "0 6px 16px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.4s ease, transform 0.3s ease",
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                cursor: "default",
              }}
            >
              {/* Sliding background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: hoverGreen,
                  transform: isHovered ? "translateX(0)" : "translateX(100%)",
                  transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: 0,
                }}
              />

              {/* Content layer */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "32px 24px",
                  color: isHovered ? textLight : textDark,
                  transition: "color 0.4s ease",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    margin: "0 0 1rem 0",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {card.title}
                </h4>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    margin: 0,
                    opacity: isHovered ? 0.95 : 0.85,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AboutUs;
