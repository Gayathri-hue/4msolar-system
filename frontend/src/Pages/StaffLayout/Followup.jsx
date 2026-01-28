import React from "react";
import { PhoneOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Typography, Row, Col, Divider } from "antd";

const { Title, Text } = Typography;

function Followup() {
  const contacts = [
    { name: "Rajesh Kumar", role: "Sales Manager", phone: "9876543210" },
    { name: "Priya Sharma", role: "Technical Support", phone: "9123456789" },
    { name: "Arun Prasad", role: "Customer Care", phone: "9988776655" },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: 12 }}>
      <Title level={4}>
        <CustomerServiceOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        Need Help? Call Our Support Team
      </Title>

      <Divider />

      {contacts.map((person, index) => (
        <Row
          key={index}
          align="middle"
          style={{
            padding: "10px 0",
            borderBottom:
              index !== contacts.length - 1 ? "1px solid #f0f0f0" : "none",
          }}
        >
          <Col span={16}>
            <Text strong>{person.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {person.role}
            </Text>
          </Col>

          <Col span={8} style={{ textAlign: "right" }}>
            <a
              href={`tel:${person.phone}`}
              style={{
                color: "#1890ff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <PhoneOutlined style={{ marginRight: 6 }} />
              {person.phone}
            </a>
          </Col>
        </Row>
      ))}
    </div>
  );
}

export default Followup;
