import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
const [statusFilter] = useState("");

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const getTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks", {
        params: {
          status: statusFilter || undefined,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("GET TASKS ERROR:", err);
    }
  }, [statusFilter]);

  const getUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("GET USERS ERROR:", err);
    }
  };

  const createTask = async () => {
    if (!title.trim()) {
      toast.warning("Title is required ⚠️");
      return;
    }

    try {
      await API.post("/tasks", {
        title,
        description,
        assignedTo: assignedTo || null,
      });

      toast.success("Task created 🎉");

      setTitle("");
      setDescription("");
      setAssignedTo("");

      getTasks();
    } catch {
      toast.error("Task creation failed ❌");
    }
  };

  const updateTask = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      toast.info("Task updated 🔄");
      getTasks();
    } catch {
      toast.error("Update failed ❌");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.error("Task deleted ❌");
      getTasks();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    if (!token) return;

    getTasks();
    getUsers();

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      forceNew: true,
    });

    const payload = JSON.parse(atob(token.split(".")[1]));
    socket.emit("join", payload.userId);

    socket.on("taskUpdated", () => {
      toast.info("Task updated in real-time ⚡");
      getTasks();
    });

    return () => socket.disconnect();
  }, [getTasks, token]);

  const inputStyle = {
    padding: "10px",
    margin: "8px 5px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%", 
  };

  return (
    <div
      style={{
        width: "95%",
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "15px",
        background: "#f5f7fa",
        borderRadius: "12px",
        minHeight: "100vh",
      }}
    >
      <Navbar logout={logout} />

     
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Create Task</h2>

       
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <input
            style={{ ...inputStyle, flex: "1 1 200px" }} 
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            style={{ ...inputStyle, flex: "1 1 200px" }}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            style={{ ...inputStyle, flex: "1 1 200px" }}
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Assign User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            onClick={createTask}
            style={{
              flex: "1 1 200px",
              padding: "10px", 
              margin: "8px 5px", 
              borderRadius: "8px",
              border: "1px solid #ccc", 
              background: "#4CAF50",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </div>
      </div>

      
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", 
          gap: "10px", 
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "600" }}>📋 Task Board</h2>

        <span
          style={{
            background: "#e6f4ff",
            color: "#1677ff",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {tasks.length} Tasks
        </span>
      </div>

      

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {["pending", "in-progress", "completed"].map((status) => (
          <div
            key={status}
            style={{
              flex: "1 1 300px",
              background: "#f4f5f7",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <h3 style={{ textAlign: "center", textTransform: "capitalize" }}>
              {status.replace("-", " ")}
            </h3>

            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task._id}
                  style={{
                    background: "white",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "8px",
                  }}
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>

                  <p style={{ fontSize: "12px" }}>
                    Assigned: {task.assignedTo ? task.assignedTo.name : "You"}
                  </p>

                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task._id, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <option value="pending">🟡 Pending</option>
                    <option value="in-progress">🔵 In Progress</option>
                    <option value="completed">🟢 Completed</option>
                  </select>

                  {task.createdBy === userId && (
                    <button
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        marginTop: "8px",
                        background: "#ff4d4f",
                        color: "white",
                        border: "none",
                        padding: "6px",
                        borderRadius: "6px",
                      }}
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
