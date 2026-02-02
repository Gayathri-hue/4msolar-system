// import React, { useEffect, useState } from "react";
// import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
// import {
//   UserOutlined,
//   LogoutOutlined,
//   MenuOutlined,
//   CloseOutlined,
//   SwapOutlined,
//   MenuUnfoldOutlined,
//   AppstoreOutlined,
//   ManOutlined,
//   WomanOutlined,
//   PlusCircleOutlined,
//   WeiboOutlined,
//   ToolOutlined,
//   DownOutlined,
// } from "@ant-design/icons";
// import "../../styles/layouts/UserLayout.scss";
// import { Avatar, Modal } from "antd";
// import logo from "../../../src/assets/Image/4M Solar Solutions Logo.png";

// function StaffLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [enquiryOpen, setEnquiryOpen] = useState(false);

//   const [user, setUser] = useState({
//     id: null,
//     leadId: null,
//     name: null,
//     email: null,
//   });

//   // Fetch user from localStorage
//   useEffect(() => {
//     const loggedUser = {
//       id: localStorage.getItem("UserID"),
//       name: localStorage.getItem("name"),
//       email: localStorage.getItem("email"),
//       leadId: localStorage.getItem("leadId"),
//     };

//     if (!loggedUser.id) {
//       // If user not logged in, redirect to login
//       navigate("/", { replace: true });
//     } else {
//       setUser(loggedUser);
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     Modal.confirm({
//       title: "Confirm Logout",
//       content: "Are you sure you want to logout?",
//       okText: "Yes",
//       cancelText: "No",
//       onOk: () => {
//         localStorage.clear();
//         navigate("/", { replace: true });
//       },
//     });
//   };

//   const toggleSidebar = () => {
//     if (window.innerWidth <= 992) {
//       setDrawerVisible(!drawerVisible);
//     } else {
//       setCollapsed(!collapsed);
//     }
//   };

//   const closeDrawer = () => setDrawerVisible(false);

//   const isEnquiryActive =
//     location.pathname.includes("/new-installation") ||
//     location.pathname.includes("/service") ||
//     location.pathname.includes("/operation-maintenance");

//   useEffect(() => {
//     if (isEnquiryActive) {
//       setEnquiryOpen(true);
//     }
//   }, [location.pathname, isEnquiryActive]);
//   const sidebarMenu = (
//     <>
//       <div className="user-sidebar-profile">
//         <Avatar
//           size={72}
//           icon={<UserOutlined />}
//           style={{
//             border: "3px solid #1677ff",
//             backgroundColor: "#1677ff",
//             color: "#fff",
//             marginBottom: 8,
//           }}
//         />
//         <div className="user-profile-name ">{user.name}</div>
//         <div className="user-profile-name ">{user.email}</div>
//         <br />
//         <div className="user-profile-id ">
//           Customer ID:<span>{user.leadId}</span>
//         </div>
//       </div>
//       <NavLink to="dashboard" onClick={closeDrawer}>
//         <AppstoreOutlined />
//         <span className="menu-text">Dashboard</span>
//       </NavLink>{" "}
//       <NavLink to="followup" onClick={closeDrawer}>
//         <WeiboOutlined />
//         <span className="menu-text">Follow Up</span>
//       </NavLink>
//       <NavLink to="postform" onClick={closeDrawer}>
//         <PlusCircleOutlined />
//         <span className="menu-text">Raise an Enquiry</span>
//       </NavLink>
//       <div
//         className={`submenu-parent user-menu-link ${
//           isEnquiryActive ? "active" : ""
//         } ${enquiryOpen ? "open" : ""}`}
//         onClick={() => setEnquiryOpen((prev) => !prev)}
//       >
//         <MenuUnfoldOutlined />
//         <span className="menu-text">My Enquiry</span>
//         <DownOutlined className="submenu-arrow" />
//       </div>
//       {/* SUB MENU */}
//       <div className={`submenu-children ${enquiryOpen ? "open" : ""}`}>
//         <NavLink
//           to="enquiryform"
//           className={({ isActive }) =>
//             `submenu-item ${isActive ? "active" : ""}`
//           }
//           onClick={closeDrawer}
//         >
//           <PlusCircleOutlined />
//           <span>New Solar Power Plant Installation</span>
//         </NavLink>

//         <NavLink
//           to="services"
//           className={({ isActive }) =>
//             `submenu-item ${isActive ? "active" : ""}`
//           }
//           onClick={closeDrawer}
//         >
//           <SwapOutlined />
//           <span>Solar Power Plant Service</span>
//         </NavLink>

//         <NavLink
//           to="operation-maintenance"
//           className={({ isActive }) =>
//             `submenu-item ${isActive ? "active" : ""}`
//           }
//           onClick={closeDrawer}
//         >
//           <ToolOutlined />
//           <span>Operation & Maintanence Service</span>
//         </NavLink>
//       </div>
//       <NavLink to="trackstatus" onClick={closeDrawer}>
//         <SwapOutlined />
//         <span className="menu-text">My Status</span>
//       </NavLink>
//       <NavLink to="service-request" onClick={closeDrawer}>
//         <SwapOutlined />
//         <span className="menu-text">Service Request</span>
//       </NavLink>
//     </>
//   );

//   return (
//     <div className="user-admin-container">
//       {/* Header */}
//       <header className="user-admin-header">
//         <div className="user-header-left">
//           <MenuOutlined className="user-toggle-btn" onClick={toggleSidebar} />
//           <img
//             src={logo}
//             alt="Logo"
//             style={{ width: "80px", height: "80px" }}
//             onClick={() => navigate("/")}
//           />
//           <h2>Customer Dashboard</h2>
//         </div>
//         <button className="user-logout-btn" onClick={handleLogout}>
//           <LogoutOutlined /> Logout
//         </button>
//       </header>

//       <div className="user-admin-body">
//         {/* Desktop Sidebar */}
//         <aside
//           className={`user-admin-sidebar user-desktop-sidebar ${
//             collapsed ? "collapsed" : ""
//           }`}
//         >
//           {sidebarMenu}
//         </aside>

//         {/* Mobile Drawer */}
//         <div
//           className={`user-mobile-drawer-overlay ${drawerVisible ? "visible" : ""}`}
//           onClick={closeDrawer}
//         >
//           <div
//             className={`user-mobile-drawer ${drawerVisible ? "visible" : ""}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="user-drawer-header">
//               <h3>Menu</h3>
//               <CloseOutlined className="user-close-btn" onClick={closeDrawer} />
//             </div>
//             {sidebarMenu}
//           </div>
//         </div>

//         {/* Main Content */}
//         <main className="user-admin-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default StaffLayout;

import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  SwapOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  WeiboOutlined,
  ToolOutlined,
  DownOutlined,
  PullRequestOutlined,
} from "@ant-design/icons";
import "../../styles/layouts/UserLayout.scss";
import { Avatar, Modal } from "antd";
import logo from "../../../src/assets/Image/4M Solar Solutions Logo.png";

function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const [user, setUser] = useState({
    id: null,
    leadId: null,
    name: null,
    email: null,
  });

  useEffect(() => {
    const loggedUser = {
      id: localStorage.getItem("UserID"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      leadId: localStorage.getItem("leadId"),
    };

    if (!loggedUser.id) {
      navigate("/", { replace: true });
    } else {
      setUser(loggedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        localStorage.clear();
        navigate("/", { replace: true });
      },
    });
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setDrawerVisible(!drawerVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeDrawer = () => setDrawerVisible(false);

  const isEnquiryActive =
    location.pathname.includes("/new-installation") ||
    location.pathname.includes("/service") ||
    location.pathname.includes("/operation-maintenance");

  useEffect(() => {
    if (isEnquiryActive) {
      setEnquiryOpen(true);
    }
  }, [location.pathname]);

  const sidebarContent = (
    <>
      {/* Logo + Profile - Top */}
      <div className="sidebar-top">
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            className="sidebar-logo"
            onClick={() => navigate("/")}
          />
        </div>

        <div className={`user-sidebar-profile ${collapsed ? "collapsed" : ""}`}>
          {/* <Avatar
            size={collapsed ? 40 : 72}
            icon={<UserOutlined />}
            style={{
              border: "3px solid #1677ff",
              backgroundColor: "#1677ff",
              color: "#fff",
            }}
          /> */}
          {!collapsed && (
            <>
              <div className="user-profile-name">{user.name}</div>
              <div className="user-profile-email">{user.email}</div>
              <div className="user-profile-id">
                Customer ID:<span>{user.leadId}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        <NavLink to="dashboard" onClick={closeDrawer} className="menu-link">
          <AppstoreOutlined />
          <span className="menu-text">Overview</span>
        </NavLink>

        <NavLink to="postform" onClick={closeDrawer} className="menu-link">
          <PlusCircleOutlined />
          <span className="menu-text">Raise an Enquiry</span>
        </NavLink>

        <div
          className={`menu-link submenu-parent ${isEnquiryActive ? "active" : ""} ${
            enquiryOpen ? "open" : ""
          }`}
          onClick={() => setEnquiryOpen((prev) => !prev)}
        >
          <MenuUnfoldOutlined />
          <span className="menu-text">My Enquiry</span>
          <DownOutlined className="submenu-arrow" />
        </div>

        <div className={`submenu-children ${enquiryOpen ? "open" : ""}`}>
          <NavLink
            to="enquiryform"
            className={({ isActive }) =>
              `submenu-item ${isActive ? "active" : ""}`
            }
            onClick={closeDrawer}
          >
            <PlusCircleOutlined />
            <span>New Solar Power Plant Installation</span>
          </NavLink>

          <NavLink
            to="services"
            className={({ isActive }) =>
              `submenu-item ${isActive ? "active" : ""}`
            }
            onClick={closeDrawer}
          >
            <SwapOutlined />
            <span>Solar Power Plant Service</span>
          </NavLink>

          <NavLink
            to="operation-maintenance"
            className={({ isActive }) =>
              `submenu-item ${isActive ? "active" : ""}`
            }
            onClick={closeDrawer}
          >
            <ToolOutlined />
            <span>Operation & Maintenance Service</span>
          </NavLink>
        </div>

        <NavLink to="trackstatus" onClick={closeDrawer} className="menu-link">
          <SwapOutlined />
          <span className="menu-text">My Status</span>
        </NavLink>

        <NavLink
          to="resquest-quote"
          onClick={closeDrawer}
          className="menu-link"
        >
          <PullRequestOutlined />
          <span className="menu-text">Service Request</span>
        </NavLink>
      </div>

      {/* Logout - Bottom */}
      <div className="sidebar-bottom">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogoutOutlined />
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="user-admin-container">
      {/* Mobile toggle button (floating) */}
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        <MenuOutlined />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`user-admin-sidebar user-desktop-sidebar ${collapsed ? "collapsed" : ""}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`user-mobile-drawer-overlay ${drawerVisible ? "visible" : ""}`}
        onClick={closeDrawer}
      >
        <div
          className={`user-mobile-drawer ${drawerVisible ? "visible" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="user-drawer-header">
            <h3>Menu</h3>
            <CloseOutlined className="user-close-btn" onClick={closeDrawer} />
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Main Content */}
      <main className="user-admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;
