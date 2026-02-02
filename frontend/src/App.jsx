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
import EmployeeLogin from "./Pages/Employee/EmployeeLogin";
import EmployeeDashboard from "./Pages/Employee/EmployeeDashboard";
import EmployeeLayout from "./Pages/Employee/EmployeeLayout";
import MyLead from "./Pages/Employee/MyLead";
import EmployeeWork from "./Pages/Admin/EmployeeWork";
import PostEnquiryForm from "./Pages/StaffLayout/PostEnquiryForm";
import Followup from "./Pages/Employee/Followup";
import OurServices from "./Pages/OurServices";
import AboutUs from "./Pages/AboutUs";
import SolarServices from "./Pages/StaffLayout/SolarServices";
import OperationMaintanence from "./Pages/StaffLayout/OperationMaintanence";
import AssignWork from "./Pages/Admin/AssignWork";
import Upload from "./Pages/Admin/Upload";

import CreateCustomerEnquiry from "./Pages/Admin/CreateCustomerEnquiry";
import ServiceRequest from "./Pages/StaffLayout/ServiceRequest";
import CustomerServiceRequest from "./Pages/Admin/CustomerServiceRequest";

function App() {
  const ProtectedRoute = ({ requiredRole, redirectTo }) => {
    const role = localStorage.getItem("role");
    const location = useLocation();

    if (!role) {
      return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    if (requiredRole && role !== requiredRole) {
      if (role === "admin") return <Navigate to="/admin" replace />;
      if (role === "employee") return <Navigate to="/employee" replace />;
      if (role === "user") return <Navigate to="/userlogin" replace />;

      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/ourservices" element={<OurServices />} />
        <Route path="/aboutus" element={<AboutUs />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/employeelogin" element={<EmployeeLogin />} />

        <Route
          element={
            <ProtectedRoute requiredRole="admin" redirectTo="/adminlogin" />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<User />} />
            <Route path="employee" element={<Employee />} />
            <Route path="enquriyform" element={<CustomerEnquiryForm />} />
            <Route path="employeework" element={<EmployeeWork />} />
            <Route path="assign-work" element={<AssignWork />} />
            <Route path="upload-excel" element={<Upload />} />
            <Route
              path="service-request"
              element={<CustomerServiceRequest />}
            />

            <Route
              path="create-customer-enquiry"
              element={<CreateCustomerEnquiry />}
            />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              requiredRole="employee"
              redirectTo="/employeelogin"
            />
          }
        >
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="mylead" element={<MyLead />} />
            <Route path="followup" element={<Followup />} />
          </Route>
        </Route>

        <Route
          element={<ProtectedRoute requiredRole="user" redirectTo="/login" />}
        >
          <Route path="/user" element={<StaffLayout />}>
            <Route index element={<DashboardChart />} />
            <Route path="dashboard" element={<DashboardChart />} />

            <Route path="enquiryform" element={<Leads />} />
            <Route path="services" element={<SolarServices />} />
            <Route
              path="operation-maintenance"
              element={<OperationMaintanence />}
            />

            <Route path="postform" element={<PostEnquiryForm />} />
            <Route path="trackstatus" element={<TrackStatus />} />
            <Route path="resquest-quote" element={<ServiceRequest />} />
          </Route>
        </Route>
        {/* 
        <Route path="/user" element={<StaffLayout />}>
          <Route index element={<DashboardChart />} />{" "}
          <Route path="dashboard" element={<DashboardChart />} />{" "}
          <Route path="enquiryform" element={<Leads />} />
          <Route path="postform" element={<PostEnquiryForm />} />
          <Route path="trackstatus" element={<TrackStatus />} />
        
        </Route> */}

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
