const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Needed for form data parsing

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/EventRoutes"));
app.use("/api/media", require("./routes/MediaRoutes"));
app.use("/api/users", require("./routes/UserRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
