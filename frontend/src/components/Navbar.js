import React from "react";

function Navbar({ logout }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
        color: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      {/* LEFT SIDE */}
      <h2 style={{ margin: 0, fontWeight: "600" }}>
        🚀 Task Manager
      </h2>

      {/* RIGHT SIDE */}
      <button
        onClick={logout}
        style={{
          background: "linear-gradient(135deg, #ff4d4f, #ff7875)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.85")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;