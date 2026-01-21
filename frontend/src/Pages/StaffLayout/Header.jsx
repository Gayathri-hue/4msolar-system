// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/layouts/Header.scss";

// function Header() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear user token (adjust key based on your storage)
//     localStorage.removeItem("token");
//     // Optionally clear all storage
//     // localStorage.clear();
//     navigate("/login"); // redirect to login page
//   };

//   return (
//     <div className="crm-header">
//       <h3>
//         <img
//           src="https://4msolarsolutions.com/wp-content/uploads/al_opt_content/IMAGE/4msolarsolutions.com/wp-content/uploads/2025/11/4M-Solar-Solutions-Logo-3-a.png.bv.webp?bv_host=4msolarsolutions.com"
//           alt="Solar System"
//           style={{
//             width: "40px",
//             height: "40px",
//             marginRight: "10px",
//             marginLeft: "30px",
//             verticalAlign: "middle",
//           }}
//         />
//       </h3>
//       <span
//         style={{
//           color: "white",
//           fontWeight: "500",
//           fontSize: "10px",
//         }}
//       >
//         {" "}
//         4M SOLAR SYSTEM
//       </span>
//       <button onClick={handleLogout} className="logout-btn">
//         Logout
//       </button>
//     </div>
//   );
// }

// export default Header;

import React from "react";
import { useNavigate } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import "../../styles/layouts/Header.scss";

function Header({ toggleSidebar, toggleMobile, isMobileMenuOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profileImageUrl");
    navigate("/login");
  };

  return (
    <div className="crm-header">
      <div className="header-left">
        <button className="mobile-toggle-btn" onClick={toggleMobile}>
          <MenuOutlined />
        </button>

        <img
          src="https://4msolarsolutions.com/wp-content/uploads/al_opt_content/IMAGE/4msolarsolutions.com/wp-content/uploads/2025/11/4M-Solar-Solutions-Logo-3-a.png.bv.webp?bv_host=4msolarsolutions.com"
          alt="4M Solar"
          className="header-logo"
        />
        <span className="header-title">4M SOLAR SYSTEM</span>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Header;
