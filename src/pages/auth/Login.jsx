import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
        background: "#f4f6fb"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center"
        }}>
          <h2 style={{
            marginBottom: "20px",
            color: "#1e3a8a"
          }}>
            User Login
          </h2>
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "15px"
              }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "15px"
              }}
              required
            />
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;