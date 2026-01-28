import React, { useState } from "react";

const greenColor = "rgba(58, 128, 23, 0.9019607843)";

function GetQuote() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! We will contact you soon.`);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section
      style={{
        padding: "60px 20px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          color: greenColor,
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Get a Quote
      </h2>

      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto 40px",
          fontSize: "16px",
          color: "#333",
          lineHeight: "1.6",
        }}
      >
        Fill out the form below and our solar experts will contact you with a
        free consultation and quote.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: greenColor,
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#3a8017")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = greenColor)
          }
        >
          Submit
        </button>
      </form>
    </section>
  );
}

export default GetQuote;
