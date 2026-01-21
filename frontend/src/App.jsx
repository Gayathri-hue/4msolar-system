import { useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import "antd/dist/reset.css";

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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<DashboardChart />} />{" "}
          <Route path="dashboard" element={<DashboardChart />} />{" "}
          <Route path="leads" element={<Leads />} />
          <Route path="profile" element={<Profile />} />
          <Route path="trackstatus" element={<TrackStatus />} />
          <Route path="chat" element={<Chat />} />
          <Route path="document" element={<Document />} />
          <Route path="payment" element={<Payment />} />
        </Route>

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
