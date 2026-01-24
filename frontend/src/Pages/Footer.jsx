import React from "react";
import { Row, Col, Typography, Space } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  LinkedinFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import logo from "../../public/Image/4m logo.webp";
import "../styles/layouts/Footer.scss";

const { Title, Text } = Typography;

function Footer() {
  return (
    <footer className="solar-footer">
      <Row gutter={[32, 32]} justify="center">
        {/* Brand & Identity */}
        <Col xs={24} sm={12} lg={6} className="footer-col">
          <div className="brand-box">
            <img src={logo} alt="4M Solar Logo" className="footer-logo" />
            {/* <Title
              level={4}
              style={{
                margin: 0,
                color: "#58a333",
                fontWeight: "600",
                fontSize: "19px",
              }}
            >
              4M Solar
            </Title> */}
          </div>
          <Text className="footer-desc">
            Leading the transition to sustainable energy with premium solar
            solutions for homes and businesses.
          </Text>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} lg={6} className="footer-col">
          <Title level={5}>Quick Links</Title>
          <ul className="footer-links">
            <li>
              <a href="#services">
                <ArrowRightOutlined /> Our Services
              </a>
            </li>
            <li>
              <a href="#projects">
                <ArrowRightOutlined /> Solar Projects
              </a>
            </li>
            <li>
              <a href="#about">
                <ArrowRightOutlined /> About Us
              </a>
            </li>
            <li>
              <a href="#contact">
                <ArrowRightOutlined /> Get a Quote
              </a>
            </li>
          </ul>
        </Col>

        {/* Contact Info */}
        <Col xs={24} sm={12} lg={6} className="footer-col">
          <Title level={5}>Get In Touch</Title>
          <Space direction="vertical" size="middle">
            <div className="contact-item">
              <EnvironmentOutlined className="contact-icon" />
              <Text className="design-size">Chennai, Tamil Nadu, India</Text>
            </div>
            <div className="contact-item">
              <PhoneOutlined className="contact-icon" />
              <Text className="design-size">+91 98765 43210</Text>
            </div>
            <div className="contact-item">
              <MailOutlined className="contact-icon" />
              <Text className="design-size">info@4msolarsystem.com</Text>
            </div>
          </Space>
        </Col>

        {/* Social & Newsletter */}
        <Col xs={24} sm={12} lg={6} className="footer-col">
          <Title level={5}>Follow Our Journey</Title>
          <div className="social-icons">
            <a href="#" className="fb">
              <FacebookFilled />
            </a>
            <a href="#" className="tw">
              <TwitterSquareFilled />
            </a>
            <a href="#" className="ig">
              <InstagramFilled />
            </a>
            <a href="#" className="li">
              <LinkedinFilled />
            </a>
          </div>
          <div className="eco-badge">
            <Text italic>🌱 100% Clean Energy</Text>
          </div>
        </Col>
      </Row>

      <div className="footer-bottom">
        <Text>
          © {new Date().getFullYear()} 4M Solar Systems. All Rights Reserved.
        </Text>
      </div>
    </footer>
  );
}

export default Footer;
