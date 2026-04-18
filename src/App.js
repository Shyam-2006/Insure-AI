import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./components/NotificationProvider";

import Home from "./pages/public/Home";
import PremiumCalculator from "./pages/public/PremiumCalculator";
import BuyPolicy from "./pages/user/BuyPolicy";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLogin from "./pages/auth/AdminLogin";
import MyPolicies from "./pages/user/MyPolicies";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePolicies from "./pages/admin/ManagePolicies";
import ClaimsManagement from "./pages/admin/ClaimsManagement";
import Notifications from "./pages/user/Notifications";
function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<PremiumCalculator />} />
          <Route path="/buy-policy" element={<BuyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/my-policies" element={<MyPolicies />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/policies" element={<ManagePolicies />} />
          <Route path="/claims" element={<ClaimsManagement />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;