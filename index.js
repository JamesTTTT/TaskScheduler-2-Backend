const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const mongoose = require("mongoose");

// Replace with your actual MongoDB connection information
const mongoURI =
  "mongodb+srv://JTMdev:Taylordev123@taskscheduler.pfisz8i.mongodb.net/test";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
