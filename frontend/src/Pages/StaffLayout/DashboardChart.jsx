import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Row, Col, Card } from "antd";
import Api from "../../Api.js";

const COLORS = ["#FFA500", "#007BFF", "#28a745"]; // Assigned, In Progress, Completed

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

  // Customer ID from localStorage
  const customerId = localStorage.getItem("UserID");

  useEffect(() => {
    // Fetch overall stats
    const fetchOverallStats = async () => {
      try {
        const res = await Api.get("/enquiry/getallstatus"); // overall stats API
        const stats = res.data;

        const chartData = [
          { name: "Assigned", value: stats.Assigned || 0 },
          { name: "In Progress", value: stats["In Progress"] || 0 },
          { name: "Completed", value: stats.Completed || 0 },
        ];

        setOverallData(chartData);
        setOverallStats(stats);
      } catch (err) {
        console.error("Error fetching overall stats:", err);
      }
    };

    // Fetch customer-specific stats
    const fetchCustomerStats = async () => {
      if (!customerId) return;
      try {
        const res = await Api.get(`/enquiry/getstatus/${customerId}`); // customer stats API
        const stats = res.data;

        const chartData = [
          { name: "Assigned", value: stats.Assigned || 0 },
          { name: "In Progress", value: stats["In Progress"] || 0 },
          { name: "Completed", value: stats.Completed || 0 },
        ];

        setCustomerData(chartData);
        setCustomerStats(stats);
      } catch (err) {
        console.error("Error fetching customer stats:", err);
      }
    };

    fetchOverallStats();
    fetchCustomerStats();
  }, [customerId]);

  // Function to render a pie chart card
  const renderPieCard = (title, data, stats) => (
    <Card
      title={title}
      bordered={false}
      style={{ height: "350px", textAlign: "center" }}
    >
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      <div
        style={{
          marginTop: "45px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div>
          <h3>Assigned</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: COLORS[0] }}>
            {stats.Assigned}
          </p>
        </div>
        <div>
          <h3>In Progress</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: COLORS[1] }}>
            {stats["In Progress"]}
          </p>
        </div>
        <div>
          <h3>Completed</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: COLORS[2] }}>
            {stats.Completed}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: "10px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          {renderPieCard("Overall Enquiry Status", overallData, overallStats)}
        </Col>
        <Col xs={24} lg={12}>
          {renderPieCard("Your Enquiry Status", customerData, customerStats)}
        </Col>
      </Row>
    </div>
  );
}

export default DashboardChart;
