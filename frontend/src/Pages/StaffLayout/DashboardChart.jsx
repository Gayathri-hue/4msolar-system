// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   PhoneOutlined,
//   ClockCircleOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { Row, Col, Card, Typography, Tag, Input, Button } from "antd";
// import Api from "../../Api.js";
// // import "../../styles/layouts/UserDashboard.scss";
// const { Title, Text } = Typography;

// const COLORS = ["#FFA500", "#007BFF", "#28a745"]; // Assigned, In Progress, Completed

// function DashboardChart() {
//   const [overallData, setOverallData] = useState([]);
//   const [overallStats, setOverallStats] = useState({
//     Assigned: 0,
//     "In Progress": 0,
//     Completed: 0,
//   });

//   const [customerData, setCustomerData] = useState([]);
//   const [customerStats, setCustomerStats] = useState({
//     Assigned: 0,
//     "In Progress": 0,
//     Completed: 0,
//   });

//   // Customer ID from localStorage
//   const customerId = localStorage.getItem("UserID");

//   useEffect(() => {
//     // Fetch overall stats
//     const fetchOverallStats = async () => {
//       try {
//         const res = await Api.get("/enquiry/getallstatus"); // overall stats API
//         const stats = res.data;

//         const chartData = [
//           { name: "Assigned", value: stats.Assigned || 0 },
//           { name: "In Progress", value: stats["In Progress"] || 0 },
//           { name: "Completed", value: stats.Completed || 0 },
//         ];

//         setOverallData(chartData);
//         setOverallStats(stats);
//       } catch (err) {
//         console.error("Error fetching overall stats:", err);
//       }
//     };

//     // Fetch customer-specific stats
//     const fetchCustomerStats = async () => {
//       if (!customerId) return;
//       try {
//         const res = await Api.get(`/enquiry/getstatus/${customerId}`); // customer stats API
//         const stats = res.data;

//         const chartData = [
//           { name: "Assigned", value: stats.Assigned || 0 },
//           { name: "In Progress", value: stats["In Progress"] || 0 },
//           { name: "Completed", value: stats.Completed || 0 },
//         ];

//         setCustomerData(chartData);
//         setCustomerStats(stats);
//       } catch (err) {
//         console.error("Error fetching customer stats:", err);
//       }
//     };

//     fetchOverallStats();
//     fetchCustomerStats();
//   }, [customerId]);

//   // Function to render a pie chart card
//   const renderPieCard = (title, data, stats) => (
//     <Card
//       title={title}
//       bordered={false}
//       style={{ height: "350px", textAlign: "center" }}
//     >
//       <ResponsiveContainer width="100%" height={250}>
//         <PieChart>
//           <Pie
//             data={data}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={80}
//             label
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend verticalAlign="bottom" height={36} />
//         </PieChart>
//       </ResponsiveContainer>

//       <div
//         style={{
//           marginTop: "45px",
//           display: "flex",
//           justifyContent: "space-around",
//         }}
//       >
//         <div>
//           <h3>Assigned</h3>
//           <p style={{ fontSize: "20px", fontWeight: "bold", color: COLORS[0] }}>
//             {stats.Assigned}
//           </p>
//         </div>
//         <div>
//           <h3>In Progress</h3>
//           <p style={{ fontSize: "20px", fontWeight: "bold", color: COLORS[1] }}>
//             {stats["In Progress"]}
//           </p>
//         </div>
//         <div>
//           <h3>Completed</h3>
//           <p style={{ fontSize: "20px", fontWeight: "bold", color: COLORS[2] }}>
//             {stats.Completed}
//           </p>
//         </div>
//       </div>
//     </Card>
//   );

//   return (
//     <div style={{ padding: "10px" }}>
//       <Row gutter={[16, 16]}>
//         <Col xs={24} lg={12}>
//           {renderPieCard("Overall Enquiry Status", overallData, overallStats)}
//         </Col>
//         <Col xs={24} lg={12}>
//           {renderPieCard("Your Enquiry Status", customerData, customerStats)}
//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default DashboardChart;import React, { useEffect, useState } from "react";

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
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  const formatPieData = (stats) => {
    return [
      { name: "Assigned", value: stats.Assigned || 0 },
      { name: "In Progress", value: stats["In Progress"] || 0 },
      { name: "Completed", value: stats.Completed || 0 },
    ].filter((item) => item.value > 0); // 0 irundha remove
  };

  useEffect(() => {
    const fetchOverallStats = async () => {
      try {
        const res = await Api.get("/enquiry/getallstatus");
        const stats = res.data;
        // setOverallData([
        //   { name: "Assigned", value: stats.Assigned || 0 },
        //   { name: "In Progress", value: stats["In Progress"] || 0 },
        //   { name: "Completed", value: stats.Completed || 0 },
        // ]);
        setOverallData(formatPieData(stats));

        // setOverallStats(stats);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCustomerStats = async () => {
      if (!customerId) return;
      try {
        const res = await Api.get(`/enquiry/getstatus/${customerId}`);
        const stats = res.data;
        // setCustomerData([
        //   { name: "Assigned", value: stats.Assigned || 0 },
        //   { name: "In Progress", value: stats["In Progress"] || 0 },
        //   { name: "Completed", value: stats.Completed || 0 },
        // ]);
        // setCustomerStats(stats);
        setCustomerData(formatPieData(stats));
      } catch (err) {
        console.error(err);
      }
    };

    fetchOverallStats();
    fetchCustomerStats();
  }, [customerId]);

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
