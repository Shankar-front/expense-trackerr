const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ✅ MIDDLEWARE (ORDER MATTERS)
app.use(cors());
app.use(express.json()); // ← THIS WILL NOT CRASH

// ✅ ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));

// ✅ BASIC TEST ROUTE (OPTIONAL)
app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
