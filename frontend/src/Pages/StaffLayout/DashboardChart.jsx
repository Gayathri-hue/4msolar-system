import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

function DashboardChart() {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 20 }}>Dashboard Overview</h2>

      {/* Top Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Leads"
              value={120}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="New Leads"
              value={35}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={50}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={35}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Second Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} md={12}>
          <Card title="Recent Activities">
            <p>📌 New lead assigned</p>
            <p>📌 Follow-up completed</p>
            <p>📌 Payment received</p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Today's Follow-ups">
            <p>📞 Call Kumar - 11:00 AM</p>
            <p>📞 Call Priya - 2:30 PM</p>
            <p>📞 Call Arjun - 5:00 PM</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardChart;
