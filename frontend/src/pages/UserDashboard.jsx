import React from "react";
import { useAuth } from "../contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>👋 Welcome User</h1>
      <p>You are logged in as: <strong>{user?.email}</strong></p>
    </div>
  );
};

export default UserDashboard;
