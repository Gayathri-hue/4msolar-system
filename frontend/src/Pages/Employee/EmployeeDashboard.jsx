import React, { useEffect, useState } from "react";
import Api from "../../Api.js";
import { Bar, Pie } from "react-chartjs-2";
import * as ChartDataLabels from "chartjs-plugin-datalabels";
import { Row, Col, Card } from "antd";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

function EmployeeDashboard() {
  const [stats, setStats] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [allstatus, setAllStatus] = useState({
    Assigned: 0,
    "In Progress": 0,
    Completed: 0,
  });

  useEffect(() => {
    Api.get("/user-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
    Api.get("/customer-count")
      .then((res) => setTotalCustomers(res.data.totalCustomers))
      .catch((err) => console.error(err));
    Api.get("/admin/getemployeecount")
      .then((res) => setEmployeeCount(res.data.totalEmployees))
      .catch((err) => console.error(err));
    Api.get("/enquiry/getallstatus")
      .then((res) => setAllStatus(res.data))
      .catch((err) => console.error(err));
  }, []);

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Customers",
        data: stats.map((s) => s.count || 0),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const totalEnquiries =
    allstatus.Assigned + allstatus["In Progress"] + allstatus.Completed;
  const statusPercentages = [
    totalEnquiries ? (allstatus.Assigned / totalEnquiries) * 100 : 0,
    totalEnquiries ? (allstatus["In Progress"] / totalEnquiries) * 100 : 0,
    totalEnquiries ? (allstatus.Completed / totalEnquiries) * 100 : 0,
  ];

  const pieData = {
    labels: ["Assigned", "In Progress", "Completed"],
    datasets: [
      {
        label: "Enquiry Status (%)",
        data: statusPercentages,
        backgroundColor: ["#FFA500", "#007BFF", "#28a745"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {" "}
      <div style={{ padding: "20px" }}>
        <h2
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          Employee Dashboard
        </h2>

        {/* First Row */}
        <Row gutter={[16, 16]}>
          {/* Left column: Customer & Employee cards */}
          <Col
            xs={24}
            lg={12}
            style={{
              display: "flex",
              alignItems: "center", // vertical center
              justifyContent: "center", // horizontal center (optional)
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    textAlign: "center",
                    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                    color: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{
                    padding: "25px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
                    Total Customers
                  </h3>

                  <h1
                    style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}
                  >
                    {totalCustomers}
                  </h1>
                </Card>
              </Col>

              <Col xs={24}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    textAlign: "center",
                    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                    color: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{
                    padding: "25px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
                    Total Employee
                  </h3>
                  <h1
                    style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}
                  >
                    {employeeCount}
                  </h1>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right column: Pie chart */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#333",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Customer Enquiry Status
                </span>
              }
              bordered={false}
              style={{ width: "100%", height: "400px", textAlign: "center" }}
            >
              <div
                style={{
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // very important
                    plugins: {
                      legend: {
                        position: "bottom",
                        align: "center",
                        labels: {
                          generateLabels: (chart) => {
                            const data = chart.data.datasets[0].data;
                            return chart.data.labels.map((label, i) => ({
                              text: `${label}: ${data[i].toFixed(1)}%`,
                              fillStyle:
                                chart.data.datasets[0].backgroundColor[i],
                            }));
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Second Row: User/Customer Bar chart full width */}
        <Row style={{ marginTop: "20px" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card
              title={
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#333",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  New Customers (Monthly)
                </span>
              }
              bordered={false}
              style={{ width: "100%", height: "400px" }}
            >
              <div style={{ height: "300px" }}>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // very important
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
