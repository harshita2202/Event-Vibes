import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Home from "./pages/HomePage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import EventGalleryPage from "./pages/EventGalleryPage";
import UploadPage from "./pages/UploadPage";
import MediaPostPage from "./pages/MediaPostPage";

// Role-based protected route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/user" element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* ✅ Event gallery for both admin + user */}
          <Route path="/media/:eventId" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <EventGalleryPage />
            </ProtectedRoute>
          } />

          {/* ✅ Upload page tied to eventId */}
          <Route path="/media/:eventId/upload" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <UploadPage />
            </ProtectedRoute>
          } />

          {/* ✅ Single media post view */}
          <Route path="/media/:eventId/post/:postId" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <MediaPostPage />
            </ProtectedRoute>
          } />

          {/* Optional: If you want a fixed upload page not tied to eventId */}
          {/* 
          <Route path="/upload" element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <UploadPage />
            </ProtectedRoute>
          } />
          */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
