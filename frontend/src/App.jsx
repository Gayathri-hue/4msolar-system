import { useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import "antd/dist/reset.css";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import StaffLayout from "./Pages/StaffLayout/StaffLayout";
import DashboardChart from "./Pages/StaffLayout/DashboardChart";
import Leads from "./Pages/StaffLayout/Leads";
import Profile from "./Pages/StaffLayout/Profile";
import TrackStatus from "./Pages/StaffLayout/TrackStatus";
import Chat from "./Pages/StaffLayout/Chat";
import Document from "./Pages/StaffLayout/Document";
import Payment from "./Pages/StaffLayout/Payment";
import AdminLogin from "./Pages/Admin/AdminLogin";
import User from "./Pages/Admin/User";
import AdminLayout from "./Pages/Admin/AdminLayout";
import Employee from "./Pages/Admin/Employee";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import HomePage from "./Pages/HomePage";
import CustomerEnquiryForm from "./Pages/Admin/CustomerEnquiryForm";

function App() {
  const ProtectedRoute = ({ requiredRole, redirectTo = "/adminlogin" }) => {
    const role = localStorage.getItem("role");
    const location = useLocation();

    if (!role) {
      return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    if (requiredRole && role !== requiredRole) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<User />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users" element={<User />} />
            <Route path="employee" element={<Employee />} />
            <Route path="enquriyform" element={<CustomerEnquiryForm />} />
          </Route>
        </Route>

        <Route path="/user" element={<StaffLayout />}>
          <Route index element={<DashboardChart />} />{" "}
          <Route path="dashboard" element={<DashboardChart />} />{" "}
          <Route path="leads" element={<Leads />} />
          <Route path="profile" element={<Profile />} />
          <Route path="trackstatus" element={<TrackStatus />} />
          <Route path="chat" element={<Chat />} />
          <Route path="document" element={<Document />} />
          <Route path="payment" element={<Payment />} />
        </Route>

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
