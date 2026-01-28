// import React, { useState, useEffect } from "react";
// import { Button, Modal, Avatar, Space, Divider } from "antd";
// import { useNavigate } from "react-router-dom";
// import {
//   LogoutOutlined,
//   UserOutlined,
//   LoginOutlined,
//   RocketOutlined,
// } from "@ant-design/icons";
// import "../styles/layouts/HomepageHeader.scss";
// import logo from "../../src/assets/Image/4M Solar Solutions Logo.png";

// function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   // --- Logic remains unchanged ---
//   useEffect(() => {
//     const userData = {
//       id: localStorage.getItem("UserID"),
//       name: localStorage.getItem("name"),
//     };
//     if (userData.id) {
//       setUser(userData);
//     }
//   }, []);

//   const handleLogout = () => {
//     Modal.confirm({
//       title: "Confirm Logout",
//       content: "Are you sure you want to logout?",
//       okText: "Yes, Logout",
//       cancelText: "Stay",
//       okButtonProps: { danger: true },
//       onOk: () => {
//         localStorage.clear();
//         setUser(null);
//         navigate("/login");
//       },
//     });
//   };

//   // useEffect(() => {
//   //   const loggedUser = {
//   //     id: localStorage.getItem("UserID"),
//   //     name: localStorage.getItem("name"),
//   //     email: localStorage.getItem("email"),
//   //   };

//   //   if (!loggedUser.id) {
//   //     navigate("/", { replace: true });
//   //   } else {
//   //     setUser(loggedUser);
//   //   }
//   // }, [navigate]);

//   return (
//     <header className="home-main-header">
//       <div className="home-header-container">
//         {/* Brand Logo */}
//         <div className="home-logo-section" onClick={() => navigate("/")}>
//           <img
//             src={logo}
//             alt="4M Solar Logo"
//             style={{
//               height: "100px",
//               width: "120px",
//               objectFit: "contain",
//               display: "block",
//             }}
//           />

//           <span className="home-logo-text">
//             <span className="home-highlight">4M</span> SOLAR
//           </span>
//         </div>

//         {/* Action Buttons */}
//         <div className="home-auth-section">
//           {user ? (
//             <Space size="middle">
//               <div
//                 className="home-user-profile"
//                 onClick={() => navigate("/user/dashboard")}
//               >
//                 <Avatar icon={<UserOutlined />} className="home-user-avatar" />
//                 <span className="home-user-name">
//                   Hi, {user.name || "User"}
//                 </span>
//               </div>
//               <Divider type="vertical" className="home-header-divider" />
//               <Button
//                 type="text"
//                 icon={<LogoutOutlined />}
//                 onClick={handleLogout}
//                 className="home-logout-btn"
//               >
//                 Logout
//               </Button>
//             </Space>
//           ) : (
//             <Space size="small">
//               <Button
//                 type="text"
//                 className="home-login-nav-btn"
//                 onClick={() => navigate("/login")}
//                 icon={<LoginOutlined />}
//               >
//                 Login
//               </Button>
//               <Button
//                 type="primary"
//                 className="home-signup-nav-btn"
//                 onClick={() => navigate("/signup")}
//                 icon={<RocketOutlined />}
//               >
//                 Get Started
//               </Button>
//             </Space>
//           )}
//         </div>
//       </div>
//     </header>
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
import logo from "../../src/assets/Image/4M Solar Solutions Logo.png";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false); // <-- track scroll

  useEffect(() => {
    const userData = {
      id: localStorage.getItem("UserID"),
      name: localStorage.getItem("name"),
    };
    if (userData.id) setUser(userData);

    const handleScroll = () => {
      if (window.scrollY > 50)
        setScrolled(true); // scroll threshold
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <header
      className={`home-main-header ${scrolled ? "scrolled" : ""}`} // <-- add class on scroll
    >
      <div className="home-header-container">
        <div className="home-logo-section" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="4M Solar Logo"
            style={{ height: "100px", width: "120px", objectFit: "contain" }}
          />
          <span className="home-logo-text">
            <span className="home-highlight">4M</span> SOLAR
          </span>
        </div>

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
                className="home-logout-btn"
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Space size="small">
              <Button
                type="text"
                className="home-login-nav-btn"
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
