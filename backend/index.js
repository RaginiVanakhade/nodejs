const express = require("express")
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbconnection");
const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/TickitRoutes")


const app =  express()
dotenv.config();
connectDB()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"]
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204);
  }
  next();
});

// Middleware
app.use(express.json());

// routes 
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("server created✅")
})