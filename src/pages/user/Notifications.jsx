import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch {
      console.error("Failed to load notifications");
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={{ display: "flex", background: "#f4f6fb", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>Your Notifications</h1>
        {loading ? <p>Loading...</p> : (
          <div style={{ marginTop: "20px" }}>
            {notifications.length === 0 ? <p>No new notifications.</p> : notifications.map(n => (
              <div key={n._id} onClick={() => !n.read && markAsRead(n._id)} style={{
                background: "white", padding: "15px", marginBottom: "10px", 
                borderRadius: "8px", borderLeft: n.read ? "4px solid #ddd" : "4px solid #3b82f6",
                cursor: n.read ? "default" : "pointer"
              }}>
                <p style={{ margin: 0, fontWeight: n.read ? "normal" : "bold" }}>{n.message}</p>
                <small style={{ color: "gray" }}>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
