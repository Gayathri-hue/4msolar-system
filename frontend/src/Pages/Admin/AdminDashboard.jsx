import React, { useEffect, useState } from "react";
import Api from "../../Api.js";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState("");
  console.log("totalcust", totalCustomers);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    // Fetch chart stats
    Api.get("/user-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));

    // Fetch total customer count
    Api.get("/customer-count")
      .then((res) => setTotalCustomers(res.data.totalCustomers))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    Api.get("/admin/getemployeecount")
      .then((res) => {
        setEmployeeCount(res.data.totalEmployees);
      })
      .catch((err) => {
        console.error("Error fetching employee count", err);
      });
  }, []);
  const data = {
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

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Show total customers */}
      <div
        style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}
      >
        Total Customers: {totalCustomers}
      </div>
      <h2>Total Employees: {employeeCount}</h2>

      {/* Chart */}
      <Bar data={data} />
    </div>
  );
}

export default AdminDashboard;
