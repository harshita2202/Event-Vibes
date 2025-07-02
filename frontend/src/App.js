import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Home from "./pages/HomePage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import EventGalleryPage from "./pages/EventGalleryPage";
import MediaPostPage from "./pages/MediaPostPage";
import UserProfile from './pages/UserProfile';
// Role-based protected route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Role-based redirection after login
const RedirectAfterLogin = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/user" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Role-Based Redirection After Login */}
          <Route path="/redirect" element={<RedirectAfterLogin />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Event Gallery (Both admin & user) */}
          <Route
            path="/media/:eventId"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <EventGalleryPage />
              </ProtectedRoute>
            }
          />

          {/* Media Upload Page (Both admin & user) */}
          <Route
            path="/media/:eventId/upload"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <MediaPostPage />
              </ProtectedRoute>
            }
          />
          <Route
             path="/profile"
             element={
             <ProtectedRoute>
               <UserProfile />
             </ProtectedRoute>
            }
          />
           
          {/* Catch-all to redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;