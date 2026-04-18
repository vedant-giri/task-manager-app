const User = require("./models/User");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Task = require("./models/Task");
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://task-manager-app-seven-sage.vercel.app"
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});


// ===== AUTH =====

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "User exists" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hash });

  res.json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid" });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.json({ token });
});


// ===== USERS =====

app.get("/users", auth, async (req, res) => {
  const users = await User.find().select("_id name");
  res.json(users);
});


// ===== TASKS =====

app.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({
    $or: [
      { createdBy: req.userId },
      { assignedTo: req.userId }
    ]
  }).populate("assignedTo", "name");

  res.json(tasks);
});


app.post("/tasks", auth, async (req, res) => {
  const { title, description, assignedTo } = req.body;

  let finalAssigned = assignedTo;

  if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
    finalAssigned = req.userId;
  }

  const task = await Task.create({
    title,
    description,
    createdBy: req.userId,
    assignedTo: finalAssigned
  });

  io.to(req.userId.toString()).emit("taskUpdated");

  if (finalAssigned !== req.userId) {
    io.to(finalAssigned.toString()).emit("taskUpdated");
  }

  res.json(task);
});


app.put("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Not found" });

  if (
    task.createdBy.toString() !== req.userId &&
    task.assignedTo.toString() !== req.userId
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  task.status = req.body.status || task.status;

  await task.save();

  io.to(task.createdBy.toString()).emit("taskUpdated");
  io.to(task.assignedTo.toString()).emit("taskUpdated");

  res.json(task);
});


app.delete("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Not found" });

  if (task.createdBy.toString() !== req.userId) {
    return res.status(403).json({ message: "Only creator can delete" });
  }

  await task.deleteOne();

  io.to(task.createdBy.toString()).emit("taskUpdated");
  io.to(task.assignedTo.toString()).emit("taskUpdated");

  res.json({ message: "Deleted" });
});


server.listen(5000, () => console.log("Server running"));