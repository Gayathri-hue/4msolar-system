// // import React, { useState, useRef, useEffect } from "react";
// // import { Link } from "react-router-dom";
// // import {
// //   RadiusSettingOutlined,
// //   CloseOutlined,
// //   CameraOutlined,
// //   UserOutlined,
// //   AppstoreOutlined,
// //   BranchesOutlined,
// //   AlipayCircleOutlined,
// //   HomeOutlined,
// //   MenuUnfoldOutlined,
// //   SwapOutlined,
// //   NodeExpandOutlined,
// // } from "@ant-design/icons";
// // import { Avatar, message } from "antd";
// // import "../../styles/layouts/StaffLayout.scss";
// // import { NavLink } from "react-router-dom";

// // const CLOUDINARY_CLOUD_NAME = "dzblzw7ll";
// // const CLOUDINARY_UPLOAD_PRESET = "darshan";

// // function StaffSidebar({ open, setOpen, onProfileUpdate }) {
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState({
// //     id: null,
// //     name: null,
// //     email: null,
// //     profileImageUrl: null,
// //     token: null,
// //   });

// //   const fileInputRef = useRef(null);

// //   // Load user info from localStorage when component mounts
// //   useEffect(() => {
// //     const storedUser = {
// //       id: localStorage.getItem("UserID"),
// //       name: localStorage.getItem("name"),
// //       email: localStorage.getItem("email"),
// //       profileImageUrl: localStorage.getItem("profileImageUrl"),
// //       token: localStorage.getItem("token"),
// //     };
// //     setUser(storedUser);
// //   }, []);

// //   const handleImageUpload = async (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     if (!user.id || !user.token) {
// //       message.error("User not loaded yet!");
// //       return;
// //     }

// //     if (file.size > 5 * 1024 * 1024) {
// //       message.error("Image size should be less than 5MB");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // 1️⃣ Upload to Cloudinary
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

// //       const response = await fetch(
// //         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
// //         { method: "POST", body: formData },
// //       );

// //       const data = await response.json();
// //       if (!data.secure_url) throw new Error("Cloudinary upload failed");

// //       const imageUrl = data.secure_url;

// //       // 2️⃣ Update backend
// //       const res = await fetch(`/api/auth/upload-profile/${user.id}`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${user.token}`,
// //         },
// //         body: JSON.stringify({ profileImageUrl: imageUrl }),
// //       });

// //       if (!res.ok) throw new Error("Backend update failed");

// //       message.success("Profile picture updated successfully!");

// //       // 3️⃣ Update frontend state & localStorage
// //       const updatedUser = { ...user, profileImageUrl: imageUrl };
// //       setUser(updatedUser);
// //       localStorage.setItem("profileImageUrl", imageUrl);

// //       // Call parent callback if provided
// //       if (onProfileUpdate) onProfileUpdate(imageUrl);
// //     } catch (err) {
// //       console.error("Profile picture upload error:", err);
// //       message.error("Failed to update profile picture. Try again!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className={`crm-sidebar ${open ? "open" : "close"}`}>
// //       {/* Sidebar Toggle */}
// //       <div className="sidebar-toggle" onClick={() => setOpen(!open)}>
// //         {open ? <CloseOutlined /> : <NodeExpandOutlined />}
// //       </div>

// //       {open && (
// //         <>
// //           <div
// //             className="sidebar-profile-section"
// //             style={{ textAlign: "center", margin: "25px 0 15px" }}
// //           >
// //             <div style={{ position: "relative", display: "inline-block" }}>
// //               <Avatar
// //                 size={85}
// //                 src={user.profileImageUrl}
// //                 icon={!user.profileImageUrl && <UserOutlined />}
// //                 style={{
// //                   border: "4px solid #fff",
// //                   boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
// //                 }}
// //               />

// //               {/* Camera Overlay */}
// //               <div
// //                 onClick={() => !loading && fileInputRef.current?.click()}
// //                 style={{
// //                   position: "absolute",
// //                   bottom: 0,
// //                   right: 0,
// //                   background: loading ? "#999" : "#1890ff",
// //                   borderRadius: "50%",
// //                   width: 36,
// //                   height: 36,
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                   cursor: loading ? "not-allowed" : "pointer",
// //                   boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
// //                   transition: "all 0.3s",
// //                 }}
// //                 title="Change Profile Picture"
// //               >
// //                 <CameraOutlined
// //                   spin={loading}
// //                   style={{ color: "#fff", fontSize: 18 }}
// //                 />
// //               </div>

// //               {/* Hidden File Input */}
// //               <input
// //                 type="file"
// //                 ref={fileInputRef}
// //                 style={{ display: "none" }}
// //                 accept="image/jpeg,image/png,image/jpg,image/webp"
// //                 onChange={handleImageUpload}
// //               />
// //             </div>

// //             <h3
// //               style={{
// //                 margin: "14px 0 4px",
// //                 color: "#fff",
// //                 fontSize: "16px",
// //               }}
// //             >
// //               {user.name || "Staff Member"}
// //             </h3>
// //             <p
// //               style={{
// //                 color: "#a8a8a8",
// //                 fontWeight: "600",
// //                 fontSize: "13px",
// //                 margin: 0,
// //               }}
// //             >
// //               {user.email || "Employee"}
// //             </p>
// //             <p
// //               style={{
// //                 color: "#a8a8a8",
// //                 fontWeight: "600",
// //                 fontSize: "13px",
// //                 margin: 0,
// //               }}
// //             >
// //               {user.UserID || "Customer Id"}
// //             </p>
// //           </div>

// //           <div className="sidebar-menu">
// //             <NavLink
// //               to="dashboard"
// //               className={({ isActive }) =>
// //                 isActive ? "menu-link active" : "menu-link"
// //               }
// //             >
// //               <AppstoreOutlined className="icons-space" /> Dashboard
// //             </NavLink>
// //             <NavLink
// //               to="profile"
// //               className={({ isActive }) =>
// //                 isActive ? "menu-link active" : "menu-link"
// //               }
// //             >
// //               <HomeOutlined className="icons-space" />
// //               Profile
// //             </NavLink>
// //             <NavLink
// //               to="leads"
// //               className={({ isActive }) =>
// //                 isActive ? "menu-link active" : "menu-link"
// //               }
// //             >
// //               <MenuUnfoldOutlined className="icons-space" />
// //               My Enquiries / My Leads
// //             </NavLink>

// //             <NavLink
// //               to="trackstatus"
// //               className={({ isActive }) =>
// //                 isActive ? "menu-link active" : "menu-link"
// //               }
// //             >
// //               <SwapOutlined className="icons-space" /> Track Status
// //             </NavLink>
// //             <NavLink
// //               to="chat"
// //               className={({ isActive }) =>
// //                 isActive ? "menu-link active" : "menu-link"
// //               }
// //             >
// //               <BranchesOutlined className="icons-space" />
// //               Enquiry / Chat
// //             </NavLink>

// //             <NavLink
// //               to="payment"
// //               className={({ isActive }) =>
// //                 isActive ? "menu-link active" : "menu-link"
// //               }
// //             >
// //               <AlipayCircleOutlined className="icons-space" /> Payments
// //             </NavLink>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // export default StaffSidebar;
// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   CloseOutlined,
//   UserOutlined,
//   AppstoreOutlined,
//   MenuUnfoldOutlined,
//   SwapOutlined,
// } from "@ant-design/icons";
// import { Avatar } from "antd";
// import "../../styles/layouts/StaffLayout.scss";

// function StaffSidebar({ open, setOpen, mobileOpen, setMobileOpen }) {
//   const [user, setUser] = useState({
//     id: null,
//     name: null,
//     email: null,
//   });

//   // Load user info from localStorage
//   useEffect(() => {
//     const storedUser = {
//       id: localStorage.getItem("UserID"),
//       name: localStorage.getItem("name"),
//       email: localStorage.getItem("email"),
//     };
//     setUser(storedUser);
//   }, []);

//   const menuItems = [
//     { to: "dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
//     {
//       to: "enquiryform",
//       icon: <MenuUnfoldOutlined />,
//       label: "My Enquiries / My Leads",
//     },
//     { to: "trackstatus", icon: <SwapOutlined />, label: "Track Status" },
//   ];

//   const isCollapsed = !open && !mobileOpen;

//   return (
//     <>
//       {mobileOpen && (
//         <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
//       )}

//       <div
//         className={`crm-sidebar ${open ? "open" : "collapsed"} ${mobileOpen ? "mobile-open" : ""}`}
//       >
//         {/* Toggle button */}
//         <div
//           className="sidebar-toggle"
//           onClick={() => {
//             if (window.innerWidth <= 1024) {
//               setMobileOpen(!mobileOpen);
//             } else {
//               setOpen(!open);
//             }
//           }}
//         >
//           {open || mobileOpen ? <CloseOutlined /> : <MenuUnfoldOutlined />}
//         </div>

//         <div className="sidebar-content">
//           {/* Profile section */}
//           {(open || mobileOpen) && (
//             <div
//               className="sidebar-profile-section"
//               style={{ textAlign: "center", margin: "25px 0 25px" }}
//             >
//               <Avatar
//                 size={85}
//                 icon={<UserOutlined />}
//                 style={{
//                   border: "4px solid #1890ff", // blue outline
//                   backgroundColor: "#1890ff", // blue circle
//                   color: "#fff", // white icon
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                 }}
//               />

//               <h3
//                 style={{
//                   margin: "16px 0 6px",
//                   color: "#fff",
//                   fontSize: "17px",
//                 }}
//               >
//                 {user.name || "Staff Member"}
//               </h3>
//               <p
//                 style={{ color: "#ddd", fontSize: "13.5px", margin: "0 0 4px" }}
//               >
//                 {user.email || "Employee"}
//               </p>
//               <p style={{ color: "#ccc", fontSize: "13px", margin: 0 }}>
//                 ID: {user.id || "—"}
//               </p>
//             </div>
//           )}

//           {/* Menu */}
//           <div className="sidebar-menu">
//             {menuItems.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `menu-link ${isActive ? "active" : ""} ${isCollapsed ? "icon-only" : ""}`
//                 }
//                 title={isCollapsed ? item.label : undefined}
//                 onClick={() => {
//                   if (mobileOpen) setMobileOpen(false);
//                 }}
//               >
//                 <span className="icons-space">{item.icon}</span>
//                 {(open || mobileOpen) && <span>{item.label}</span>}
//               </NavLink>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default StaffSidebar;
