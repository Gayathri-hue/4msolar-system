// import React, { useEffect, useState } from "react";
// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import {
//   UserOutlined,
//   LogoutOutlined,
//   MenuOutlined,
//   CloseOutlined,
//   SwapOutlined,
//   MenuUnfoldOutlined,
//   AppstoreOutlined,
// } from "@ant-design/icons";
// import "../../styles/Admin/Admin.scss";
// import "../../styles/layouts/StaffLayout.scss";
// import { Avatar, Modal } from "antd";
// import logo from "../../../public/Image/4m logo.webp";

// function StaffLayout() {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const [drawerVisible, setDrawerVisible] = useState(false);

//   const [user, setUser] = useState({
//     id: null,
//     name: null,
//     email: null,
//   });

//   useEffect(() => {
//     setUser({
//       id: localStorage.getItem("UserID"),
//       name: localStorage.getItem("name"),
//       email: localStorage.getItem("email"),
//     });
//   }, []);

//   const handleLogout = () => {
//     Modal.confirm({
//       title: "Confirm Logout",
//       content: "Are you sure you want to logout?",
//       okText: "Yes",
//       cancelText: "No",
//       onOk: () => {
//         localStorage.clear();
//         navigate("/");
//       },
//     });
//   };

//   useEffect(() => {
//     const handleBackButton = (e) => {
//       if (user?.id) {
//         e.preventDefault();
//         e.returnValue = ""; // Chrome requires this to trigger the confirmation
//       }
//     };
//     window.addEventListener("beforeunload", handleBackButton);

//     return () => window.removeEventListener("beforeunload", handleBackButton);
//   }, [user]);

//   const toggleSidebar = () => {
//     if (window.innerWidth <= 992) {
//       setDrawerVisible(!drawerVisible);
//     } else {
//       setCollapsed(!collapsed);
//     }
//   };

//   const closeDrawer = () => setDrawerVisible(false);

//   const sidebarMenu = (
//     <>
//       <div className="sidebar-profile">
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
//         <div className="profile-name ">{user.name}</div>
//         <div className="profile-name ">{user.email}</div>
//         <br />
//         <div className="profile-id ">
//           Customer ID:<span>{user.id}</span>
//         </div>
//       </div>

//       <NavLink to="dashboard" onClick={closeDrawer}>
//         <AppstoreOutlined />
//         <span>Dashboard</span>
//       </NavLink>

//       <NavLink to="enquiryform" onClick={closeDrawer}>
//         <MenuUnfoldOutlined />
//         <span>My Enquiry</span>
//       </NavLink>

//       <NavLink to="trackstatus" onClick={closeDrawer}>
//         <SwapOutlined />
//         <span>My Status</span>
//       </NavLink>
//     </>
//   );

//   return (
//     <div className="admin-container">
//       {/* Header */}
//       <header className="admin-header">
//         <div className="header-left">
//           <MenuOutlined className="toggle-btn" onClick={toggleSidebar} />
//           <img
//             src={logo}
//             alt="Logo"
//             style={{ width: "40px", height: "40px" }}
//             onClick={() => navigate("/")}
//           />
//           <h2>Customer Dashboard</h2>
//         </div>
//         <button className="logout-btn" onClick={handleLogout}>
//           <LogoutOutlined /> Logout
//         </button>
//       </header>

//       <div className="admin-body">
//         {/* Desktop Sidebar */}
//         <aside
//           className={`admin-sidebar desktop-sidebar ${
//             collapsed ? "collapsed" : ""
//           }`}
//         >
//           {sidebarMenu}
//         </aside>

//         {/* Mobile Drawer */}
//         <div
//           className={`mobile-drawer-overlay ${drawerVisible ? "visible" : ""}`}
//           onClick={closeDrawer}
//         >
//           <div
//             className={`mobile-drawer ${drawerVisible ? "visible" : ""}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="drawer-header">
//               <h3>Menu</h3>
//               <CloseOutlined className="close-btn" onClick={closeDrawer} />
//             </div>
//             {sidebarMenu}
//           </div>
//         </div>

//         {/* Main Content */}
//         <main className="admin-content">
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
  ManOutlined,
  WomanOutlined,
  PlusCircleOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import "../../styles/layouts/UserLayout.scss";
import { Avatar, Modal } from "antd";
import logo from "../../../src/assets/Image/4M Solar Solutions Logo.png";

function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [user, setUser] = useState({
    id: null,
    name: null,
    email: null,
  });

  // Fetch user from localStorage
  useEffect(() => {
    const loggedUser = {
      id: localStorage.getItem("UserID"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
    };

    if (!loggedUser.id) {
      // If user not logged in, redirect to login
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

  const sidebarMenu = (
    <>
      <div className="user-sidebar-profile">
        <Avatar
          size={72}
          icon={<UserOutlined />}
          style={{
            border: "3px solid #1677ff",
            backgroundColor: "#1677ff",
            color: "#fff",
            marginBottom: 8,
          }}
        />
        <div className="user-profile-name ">{user.name}</div>
        <div className="user-profile-name ">{user.email}</div>
        <br />
        <div className="user-profile-id ">
          Customer ID:<span>{user.id}</span>
        </div>
      </div>
      <NavLink to="dashboard" onClick={closeDrawer}>
        <AppstoreOutlined />
        <span className="menu-text">Dashboard</span>
      </NavLink>{" "}
      <NavLink to="followup" onClick={closeDrawer}>
        <WeiboOutlined />
        <span className="menu-text">Follow Up</span>
      </NavLink>
      <NavLink to="postform" onClick={closeDrawer}>
        <PlusCircleOutlined />
        <span className="menu-text">Raise an Enquiry</span>
      </NavLink>
      <NavLink
        to="/user/enquiryform"
        onClick={closeDrawer}
        // className={
        //   location.pathname.startsWith("/user/enquiryform") ||
        //   location.pathname.startsWith("/user/postform")
        //     ? "active"
        //     : ""
        // }
      >
        <MenuUnfoldOutlined />
        <span className="menu-text">My Enquiry</span>
      </NavLink>
      <NavLink to="trackstatus" onClick={closeDrawer}>
        <SwapOutlined />
        <span className="menu-text">My Status</span>
      </NavLink>
    </>
  );

  return (
    <div className="user-admin-container">
      {/* Header */}
      <header className="user-admin-header">
        <div className="user-header-left">
          <MenuOutlined className="user-toggle-btn" onClick={toggleSidebar} />
          <img
            src={logo}
            alt="Logo"
            style={{ width: "80px", height: "80px" }}
            onClick={() => navigate("/")}
          />
          <h2>Customer Dashboard</h2>
        </div>
        <button className="user-logout-btn" onClick={handleLogout}>
          <LogoutOutlined /> Logout
        </button>
      </header>

      <div className="user-admin-body">
        {/* Desktop Sidebar */}
        <aside
          className={`user-admin-sidebar user-desktop-sidebar ${
            collapsed ? "collapsed" : ""
          }`}
        >
          {sidebarMenu}
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
            {sidebarMenu}
          </div>
        </div>

        {/* Main Content */}
        <main className="user-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;
