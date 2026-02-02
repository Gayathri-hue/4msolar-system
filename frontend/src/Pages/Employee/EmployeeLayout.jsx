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
  WechatWorkOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import "../../styles/Admin/Admin.scss";
import { Modal } from "antd";

const EmployeeLayout = () => {
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
        navigate("/");
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

  // inside EmployeeLayout component
  const employeeData = JSON.parse(localStorage.getItem("employeeData")) || {};

  const sidebarProfile = (
    <div
      style={{
        textAlign: "center",
        padding: "20px 10px",
        borderBottom: "1px solid #eee",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          margin: "0 auto 10px",
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          color: "#555",
        }}
      >
        {employeeData.avatar ? (
          <img
            src={employeeData.avatar}
            alt="Employee Avatar"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <UserOutlined style={{ fontSize: "30px" }} />
        )}
      </div>
      <div>
        <h4
          style={{
            margin: "0",
            fontSize: "16px",
            fontWeight: "bold",
            wordWrap: "break-word",
          }}
        >
          {employeeData.name || "Employee Name"}
        </h4>
        <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#555" }}>
          Employee ID: {employeeData.employeeId || "EMPXXX"}
        </p>
      </div>
    </div>
  );

  const sidebarContent = (
    <>
      {sidebarProfile}
      <NavLink to="dashboard" onClick={closeDrawer}>
        <RadiusUprightOutlined /> <span>Overview</span>
      </NavLink>
      <NavLink to="followup" onClick={closeDrawer} className="menu-link">
        <WeiboOutlined />
        <span className="menu-text">Follow Up</span>
      </NavLink>

      <NavLink to="mylead" onClick={closeDrawer}>
        <WechatWorkOutlined />
        <span>My Leads</span>
      </NavLink>

      {/* You can add more links here */}
    </>
  );

  return (
    <div className="admin-container">
      {/* Header - always visible */}
      <header className="admin-header">
        <div className="header-left">
          <MenuOutlined className="toggle-btn" onClick={toggleSidebar} />
          <h2>Employee Dashboard</h2>
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

export default EmployeeLayout;
