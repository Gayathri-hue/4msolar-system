import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  RadiusUprightOutlined,
  FormOutlined,
  FileWordOutlined,
  UpSquareOutlined,
  FormatPainterOutlined,
  ScheduleOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import "../../styles/Admin/Admin.scss";
import { Modal } from "antd";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [drawerVisible, setDrawerVisible] = useState(false); // mobile drawer

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        localStorage.clear();
        navigate("/adminlogin");
      },
    });
  };

  const toggleSidebar = () => {
    // On mobile → control drawer
    // On desktop → collapse/expand sidebar
    if (window.innerWidth <= 992) {
      setDrawerVisible(!drawerVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeDrawer = () => setDrawerVisible(false);

  const sidebarContent = (
    <>
      <NavLink to="dashboard" onClick={closeDrawer}>
        <RadiusUprightOutlined /> <span>Overview</span>
      </NavLink>
      <NavLink to="users" onClick={closeDrawer}>
        <UserOutlined /> <span>Customers</span>
      </NavLink>{" "}
      <NavLink to="upload-excel" onClick={closeDrawer}>
        <UpSquareOutlined /> <span>Upload User(EXcel)</span>
      </NavLink>
      <NavLink to="employee" onClick={closeDrawer}>
        <TeamOutlined /> <span>Employees</span>
      </NavLink>
      <NavLink to="create-customer-enquiry" onClick={closeDrawer}>
        <FormOutlined />
        <span>Create Customer Enquiry</span>
      </NavLink>
      <NavLink to="enquriyform" onClick={closeDrawer}>
        <FormatPainterOutlined />
        <span>Customer Enquiry Form</span>
      </NavLink>
      <NavLink to="assign-work" onClick={closeDrawer}>
        <ScheduleOutlined />
        <span>Assign Task &Set Payment</span>
      </NavLink>
      <NavLink to="employeework" onClick={closeDrawer}>
        <FileWordOutlined />
        <span>Employee Leads</span>
      </NavLink>
      <NavLink to="service-request" onClick={closeDrawer}>
        <IssuesCloseOutlined />
        <span>Service Request</span>
      </NavLink>
    </>
  );

  return (
    <div className="admin-container">
      {/* Header - always visible */}
      <header className="admin-header">
        <div className="header-left">
          <MenuOutlined className="toggle-btn" onClick={toggleSidebar} />
          <h2>Admin Dashboard</h2>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogoutOutlined /> Logout
        </button>
      </header>

      <div className="admin-body">
        {/* Desktop Sidebar */}
        <aside
          className={`admin-sidebar desktop-sidebar ${collapsed ? "collapsed" : ""}`}
        >
          {sidebarContent}
        </aside>

        {/* Mobile Drawer */}
        <div
          className={`mobile-drawer-overlay ${drawerVisible ? "visible" : ""}`}
          onClick={closeDrawer} // click outside → close
        >
          <div
            className={`mobile-drawer ${drawerVisible ? "visible" : ""}`}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="drawer-header">
              <h3>Menu</h3>
              <CloseOutlined className="close-btn" onClick={closeDrawer} />
            </div>
            {sidebarContent}
          </div>
        </div>

        {/* Main content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
