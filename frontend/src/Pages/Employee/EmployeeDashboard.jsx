// import React, { useEffect, useState } from "react";
// import Api from "../../Api.js";
// import { Bar, Pie } from "react-chartjs-2";
// import * as ChartDataLabels from "chartjs-plugin-datalabels";
// import { Row, Col, Card } from "antd";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels,
// );

// function EmployeeDashboard() {
//   const [stats, setStats] = useState([]);
//   const [totalCustomers, setTotalCustomers] = useState(0);
//   const [employeeCount, setEmployeeCount] = useState(0);
//   const [allstatus, setAllStatus] = useState({
//     Assigned: 0,
//     "In Progress": 0,
//     Completed: 0,
//   });

//   useEffect(() => {
//     Api.get("/user-stats")
//       .then((res) => setStats(res.data))
//       .catch((err) => console.error(err));
//     Api.get("/customer-count")
//       .then((res) => setTotalCustomers(res.data.totalCustomers))
//       .catch((err) => console.error(err));
//     Api.get("/admin/getemployeecount")
//       .then((res) => setEmployeeCount(res.data.totalEmployees))
//       .catch((err) => console.error(err));
//     Api.get("/employee/my-leads-status").then((res) => setAllStatus(res.data));
//   }, []);

//   const totalLeads =
//     allstatus.Assigned + allstatus["In Progress"] + allstatus.Completed;

//   const barData = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "New Customers",
//         data: stats.map((s) => s.count || 0),
//         backgroundColor: "rgba(75,192,192,0.6)",
//       },
//     ],
//   };

//   const totalEnquiries =
//     allstatus.Assigned + allstatus["In Progress"] + allstatus.Completed;
//   const statusPercentages = [
//     totalEnquiries ? (allstatus.Assigned / totalEnquiries) * 100 : 0,
//     totalEnquiries ? (allstatus["In Progress"] / totalEnquiries) * 100 : 0,
//     totalEnquiries ? (allstatus.Completed / totalEnquiries) * 100 : 0,
//   ];

//   const pieData = {
//     labels: ["Assigned", "In Progress", "Completed"],
//     datasets: [
//       {
//         label: "Enquiry Status (%)",
//         data: statusPercentages,
//         backgroundColor: ["#FFA500", "#007BFF", "#28a745"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div>
//       {" "}
//       <div style={{ padding: "20px" }}>
//         <h2 className="front-title">Employee Dashboard</h2>

//         {/* First Row */}
//         <Row gutter={[16, 16]}>
//           {/* Left column: Customer & Employee cards */}
//           <Col
//             xs={24}
//             lg={12}
//             style={{
//               display: "flex",
//               alignItems: "center", // vertical center
//               justifyContent: "center", // horizontal center (optional)
//             }}
//           >
//             <Row gutter={[16, 16]}>
//               <Col xs={24}>
//                 <Card
//                   bordered={false}
//                   hoverable
//                   style={{
//                     textAlign: "center",
//                     background: "linear-gradient(135deg, #4facfe, #00f2fe)",
//                     color: "#fff",
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                     transition: "all 0.3s ease",
//                   }}
//                   bodyStyle={{
//                     padding: "25px",
//                   }}
//                 >
//                   <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
//                     Total Leads
//                   </h3>

//                   <h1
//                     style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}
//                   >
//                     {totalLeads}
//                   </h1>
//                 </Card>
//               </Col>

//               <Col xs={24}>
//                 <Card
//                   bordered={false}
//                   hoverable
//                   style={{
//                     textAlign: "center",
//                     background: "linear-gradient(135deg, #4facfe, #00f2fe)",
//                     color: "#fff",
//                     borderRadius: "12px",
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                     transition: "all 0.3s ease",
//                   }}
//                   bodyStyle={{
//                     padding: "25px",
//                   }}
//                 >
//                   <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
//                     Total Employee
//                   </h3>
//                   <h1
//                     style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}
//                   >
//                     {employeeCount}
//                   </h1>
//                 </Card>
//               </Col>
//             </Row>
//           </Col>

//           {/* Right column: Pie chart */}
//           <Col xs={24} lg={12}>
//             <Card
//               title={
//                 <span
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "600",
//                     color: "#333",
//                     textAlign: "center",
//                     display: "block",
//                   }}
//                 >
//                   Customer Enquiry Status
//                 </span>
//               }
//               bordered={false}
//               style={{ width: "100%", height: "400px", textAlign: "center" }}
//             >
//               <div
//                 style={{
//                   height: "300px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <Pie
//                   data={pieData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false, // very important
//                     plugins: {
//                       legend: {
//                         position: "bottom",
//                         align: "center",
//                         labels: {
//                           generateLabels: (chart) => {
//                             const data = chart.data.datasets[0].data;
//                             return chart.data.labels.map((label, i) => ({
//                               text: `${label}: ${data[i].toFixed(1)}%`,
//                               fillStyle:
//                                 chart.data.datasets[0].backgroundColor[i],
//                             }));
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </Card>
//           </Col>
//         </Row>

//         {/* Second Row: User/Customer Bar chart full width */}
//         <Row style={{ marginTop: "20px" }}>
//           <Col xs={24} sm={24} md={24} lg={24} xl={24}>
//             <Card
//               title={
//                 <span
//                   style={{
//                     fontSize: "20px",
//                     fontWeight: "600",
//                     color: "#333",
//                     textAlign: "center",
//                     display: "block",
//                   }}
//                 >
//                   New Customers (Monthly)
//                 </span>
//               }
//               bordered={false}
//               style={{ width: "100%", height: "400px" }}
//             >
//               <div style={{ height: "300px" }}>
//                 <Bar
//                   data={barData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false, // keep your card/design size
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           // Force integer values on Y-axis
//                           callback: function (value) {
//                             if (Number.isInteger(value)) return value;
//                           },
//                           stepSize: 1, // optional, ensures steps are 1 unit
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// }

// export default EmployeeDashboard;
import React, { useEffect, useState } from "react";
import Api from "../../Api.js";
import { Pie } from "react-chartjs-2";
import { Card, Row, Col, Spin, Typography } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;

function EmployeeDashboard() {
  const [stats, setStats] = useState({
    Assigned: 0,
    "In Progress": 0,
    Completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("employeeToken");
        const res = await Api.get("/employee/my-leads-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data || { Assigned: 0, "In Progress": 0, Completed: 0 });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStats();
  }, []);

  const totalLeads = stats.Assigned + stats["In Progress"] + stats.Completed;

  const pieData = {
    labels: ["Assigned", "In Progress", "Completed"],
    datasets: [
      {
        data: [stats.Assigned, stats["In Progress"], stats.Completed],
        backgroundColor: ["#fa8c16", "#1890ff", "#52c41a"],
        borderColor: ["#d46b08", "#096dd9", "#389e0d"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ padding: "24px", background: "#f9f9f9", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: 32, textAlign: "center" }}>
        My Employee Dashboard
      </Title>

      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {/* Left Side - Stats Cards */}
          <Col
            xs={24}
            lg={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Row gutter={[16, 16]} style={{ width: "90%" }}>
              {/* Total Leads - Bigger card */}
              <Col span={24}>
                <Card
                  title="Total Assigned Leads"
                  bordered={false}
                  style={{
                    background: "linear-gradient(135deg, #e6f7ff, #bae7ff)",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <h1
                      style={{
                        fontSize: 56,
                        margin: 0,
                        color: "#1890ff",
                        fontWeight: "bold",
                      }}
                    >
                      {totalLeads}
                    </h1>
                  </div>
                </Card>
              </Col>

              {/* Three smaller status cards */}
              <Col xs={8}>
                <Card
                  title="Assigned"
                  bordered={false}
                  style={{
                    background: "#fff7e6",
                    borderRadius: 12,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <h2 style={{ color: "#fa8c16", margin: 0, fontSize: 32 }}>
                    {stats.Assigned}
                  </h2>
                </Card>
              </Col>

              <Col xs={8}>
                <Card
                  title="In Progress"
                  bordered={false}
                  style={{
                    background: "#e6f7ff",
                    borderRadius: 12,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <h2 style={{ color: "#1890ff", margin: 0, fontSize: 32 }}>
                    {stats["In Progress"]}
                  </h2>
                </Card>
              </Col>

              <Col xs={8}>
                <Card
                  title="Completed"
                  bordered={false}
                  style={{
                    background: "#f6ffed",
                    borderRadius: 12,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <h2 style={{ color: "#52c41a", margin: 0, fontSize: 32 }}>
                    {stats.Completed}
                  </h2>
                </Card>
              </Col>
            </Row>
          </Col>

          {/* Right Side - Pie Chart */}
          <Col xs={24} lg={12}>
            <Card
              title="Lead Status Distribution"
              bordered={false}
              style={{
                height: "100%",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ height: "420px", padding: "20px 0" }}>
                {totalLeads > 0 ? (
                  <Pie data={pieData} options={pieOptions} />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#888",
                      fontSize: 18,
                    }}
                  >
                    No leads assigned yet
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export default EmployeeDashboard;
