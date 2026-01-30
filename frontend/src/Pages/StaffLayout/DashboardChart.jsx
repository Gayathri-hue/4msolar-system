import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, Row, Col, Typography } from "antd";
import Api from "../../Api.js";
import "../../styles/layouts/UserDashboard.scss";
import { useEffect, useState } from "react";

const { Title } = Typography;
const COLORS = ["#FFA500", "#007BFF", "#28a745"];

function DashboardChart() {
  const [overallData, setOverallData] = useState([]);
  const [overallStats, setOverallStats] = useState({
    Assigned: 0,
    "In Progress": 0,
    Completed: 0,
  });
  const [customerData, setCustomerData] = useState([]);
  const [customerStats, setCustomerStats] = useState({
    Assigned: 0,
    "In Progress": 0,
    Completed: 0,
  });
  const [greeting, setGreeting] = useState("");

  const userName = localStorage.getItem("name");
  const customerId = localStorage.getItem("UserID");

  // Greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  // Helper to format data for PieChart (remove 0 values)
  const formatPieData = (stats) => {
    return [
      { name: "Assigned", value: stats.Assigned || 0 },
      { name: "In Progress", value: stats["In Progress"] || 0 },
      { name: "Completed", value: stats.Completed || 0 },
    ].filter((item) => item.value > 0);
  };

  // Fetch overall & customer stats
  useEffect(() => {
    const fetchOverallStats = async () => {
      try {
        const res = await Api.get("/enquiry/getallstatus");
        const stats = res.data;

        setOverallStats(stats); // <-- Update numeric counts
        setOverallData(formatPieData(stats)); // <-- Pie chart data
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCustomerStats = async () => {
      if (!customerId) return;
      try {
        const res = await Api.get(`/enquiry/getstatus/${customerId}`);
        const stats = res.data;

        setCustomerStats(stats); // <-- Update numeric counts
        setCustomerData(formatPieData(stats)); // <-- Pie chart data
      } catch (err) {
        console.error(err);
      }
    };

    fetchOverallStats();
    fetchCustomerStats();
  }, [customerId]);

  // Normal Pie Card
  const renderNormalPieCard = (title, data, stats) => (
    <Card className="pie-card normal">
      <Title level={4}>{title}</Title>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="stats-row">
        {["Assigned", "In Progress", "Completed"].map((key, i) => (
          <div className="stat-item" key={i}>
            <span className="dot" style={{ backgroundColor: COLORS[i] }}></span>
            <div>
              <h4>{key}</h4>
              <p style={{ color: COLORS[i] }}>{stats[key] || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  // Round Pie Card
  const renderRoundPieCard = (title, data, stats) => (
    <Card className="pie-card round">
      <Title level={4} style={{ color: "#fff", marginBottom: 20 }}>
        {title}
      </Title>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1e40af",
              border: "none",
              borderRadius: 8,
              color: "#fff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="stats-row round-stats">
        {["Assigned", "In Progress", "Completed"].map((key, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-value" style={{ color: COLORS[i] }}>
              {stats[key] || 0}
            </div>
            <div className="stat-label">{key}</div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="dashboard-chart-container">
      <h2 style={{ marginBottom: 20 }}>
        {greeting},{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>{userName}</span>{" "}
        👋
      </h2>
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} md={12} lg={12} xl={12}>
          {renderNormalPieCard(
            "Overall Enquiry Status",
            overallData,
            overallStats,
          )}
        </Col>
        <Col xs={24} md={12} lg={12} xl={12}>
          {renderRoundPieCard(
            "Your Enquiry Status",
            customerData,
            customerStats,
          )}
        </Col>
      </Row>
    </div>
  );
}

export default DashboardChart;
