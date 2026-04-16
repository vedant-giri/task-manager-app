const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await mongoose.connection.collection("tasks").deleteMany({});
    console.log("Tasks cleared");
    process.exit();
  });