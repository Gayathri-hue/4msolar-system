// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import StaffSidebar from "./StaffSidebar";
// import Header from "./Header";
// import "../../styles/layouts/StaffLayout.scss";

// function StaffLayout() {
//   const [open, setOpen] = useState(true);

//   return (
//     <div className="crm-layout">
//       <StaffSidebar open={open} setOpen={setOpen} />

//       <div className="crm-main">
//         <Header />

//         <div className="crm-content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StaffLayout;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import Header from "./Header";
import "../../styles/layouts/StaffLayout.scss";

function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop: open by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="crm-layout">
      <StaffSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className="crm-main">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          toggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />

        <div className="crm-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StaffLayout;
