// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "antd";
// import { useNavigate } from "react-router-dom";
// import "../styles/layouts/HomepageHeader.scss";
// import { LogoutOutlined } from "@ant-design/icons";

// function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // Load user info from localStorage on mount
//   useEffect(() => {
//     const userData = {
//       id: localStorage.getItem("UserID"),
//       name: localStorage.getItem("name"),
//     };
//     if (userData.id) {
//       setUser(userData);
//     }
//   }, []);

//   // Handle logout with confirmation
//   const handleLogout = () => {
//     Modal.confirm({
//       title: "Confirm Logout",
//       content: "Are you sure you want to logout?",
//       okText: "Yes",
//       cancelText: "No",
//       onOk: () => {
//         localStorage.clear();
//         setUser(null);
//         navigate("/login"); // Send user to login page
//       },
//     });
//   };

//   // Fetch user from localStorage
//   useEffect(() => {
//     const loggedUser = {
//       id: localStorage.getItem("UserID"),
//       name: localStorage.getItem("name"),
//       email: localStorage.getItem("email"),
//     };

//     if (!loggedUser.id) {
//       // If user not logged in, redirect to login
//       navigate("/", { replace: true });
//     } else {
//       setUser(loggedUser);
//       // Replace history state to prevent going back to login
//       window.history.pushState(null, "", window.location.href);
//       window.onpopstate = () => {
//         // Block back navigation
//         Modal.confirm({
//           title: "Logout?",
//           content:
//             "You are currently logged in. Do you want to logout and leave?",
//           okText: "Yes, Logout",
//           cancelText: "No",
//           onOk: () => {
//             localStorage.clear();
//             navigate("/", { replace: true });
//           },
//         });
//         // Keep the page
//         window.history.pushState(null, "", window.location.href);
//       };
//     }
//   }, [navigate]);

//   return (
//     <div
//       className="header"
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "10px 20px",
//       }}
//     >
//       <div
//         className="logo"
//         style={{ cursor: "pointer", fontWeight: "700", fontSize: "24px" }}
//         onClick={() => navigate("/")}
//       >
//         4M Solar System
//       </div>

//       <div className="auth-buttons">
//         {user ? (
//           <>
//             <Button
//               type="primary"
//               onClick={handleLogout}
//               style={{ marginRight: "10px" }}
//             >
//               Logout
//             </Button>
//             <Button type="primary" onClick={() => navigate("/user/dashboard")}>
//               Dashboard <LogoutOutlined />
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button
//               type="default"
//               onClick={() => navigate("/login")}
//               style={{ marginRight: "10px" }}
//             >
//               Login
//             </Button>
//             <Button type="primary" onClick={() => navigate("/signup")}>
//               Sign Up
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import { Button, Modal, Avatar, Space, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  UserOutlined,
  LoginOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import "../styles/layouts/HomepageHeader.scss";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // --- Logic remains unchanged ---
  useEffect(() => {
    const userData = {
      id: localStorage.getItem("UserID"),
      name: localStorage.getItem("name"),
    };
    if (userData.id) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes, Logout",
      cancelText: "Stay",
      okButtonProps: { danger: true },
      onOk: () => {
        localStorage.clear();
        setUser(null);
        navigate("/login");
      },
    });
  };

  useEffect(() => {
    const loggedUser = {
      id: localStorage.getItem("UserID"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
    };
    if (!loggedUser.id) {
      navigate("/", { replace: true });
    } else {
      setUser(loggedUser);
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        Modal.confirm({
          title: "Logout?",
          content:
            "You are currently logged in. Do you want to logout and leave?",
          onOk: () => {
            localStorage.clear();
            navigate("/", { replace: true });
          },
        });
        window.history.pushState(null, "", window.location.href);
      };
    }
  }, [navigate]);
  // --- End of unchanged logic ---

  return (
    <header className="home-main-header">
      <div className="home-header-container">
        {/* Brand Logo */}
        <div className="home-logo-section" onClick={() => navigate("/")}>
          <div className="home-logo-icon">☀️</div>
          <span className="home-logo-text">
            <span className="home-highlight">4M</span> SOLAR
          </span>
        </div>

        {/* Action Buttons */}
        <div className="home-auth-section">
          {user ? (
            <Space size="middle">
              <div
                className="home-user-profile"
                onClick={() => navigate("/user/dashboard")}
              >
                <Avatar icon={<UserOutlined />} className="home-user-avatar" />
                <span className="home-user-name">
                  Hi, {user.name || "User"}
                </span>
              </div>
              <Divider type="vertical" className="home-header-divider" />
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Space size="small">
              <Button
                type="text"
                className="login-nav-btn"
                onClick={() => navigate("/login")}
                icon={<LoginOutlined />}
              >
                Login
              </Button>
              <Button
                type="primary"
                className="home-signup-nav-btn"
                onClick={() => navigate("/signup")}
                icon={<RocketOutlined />}
              >
                Get Started
              </Button>
            </Space>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
