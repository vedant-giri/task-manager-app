import React, { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f5f9",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", 
          width: "100%",
          maxWidth: "1000px",
          minHeight: "500px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        
        <div
          style={{
            flex: "1 1 400px", 
            background: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px",
            borderRight: "1px solid #e5e7eb",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "15px",
              color: "#111827",
            }}
          >
            Task Manager
          </h1>

          <p
            style={{
              color: "#6b7280",
              lineHeight: "1.6",
              fontSize: "14px",
            }}
          >
            Manage your tasks efficiently and stay organized with a clean and
            simple workflow.
          </p>
        </div>

       
        <div
          style={{
            flex: "1 1 400px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
              fontSize: "24px",
              color: "#111827",
            }}
          >
            Sign in
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", 
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%", 
              padding: "14px",
              fontSize: "14px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>

          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            Don’t have an account?{" "}
            <span
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => (window.location.href = "/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;